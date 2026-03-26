const User = require('../models/User');
const Wallet = require('../models/Wallet');
const CallSession = require('../models/CallSessions');
const CallLog = require('../models/CallLogs');

const { createRoom, createToken } = require('../helpers/enablex.helper');
const { sendPushNotification } = require('../helpers/notification.helper');
const { throwError } = require('../utils');

const MINIMUM_BALANCE_REQUIRED = 12;

const initiateCall = async (req, res, next) => {
    try {
        const callerId = req.userId
        const { receiverId, callType } = req.body;

        // Check wallet balance
        const wallet = await Wallet.findOne({ userId: callerId });
        if (!wallet || wallet.balances.INR < MINIMUM_BALANCE_REQUIRED) {
            return throwError(400, `Minimum wallet balance of ${MINIMUM_BALANCE_REQUIRED} Rs is required to initiate a call.`);
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return throwError(404, "Receiver not found");
        }

        const caller = await User.findById(callerId);

        // EnableX - Create Room
        const roomName = `Call_${callerId}_to_${receiverId}`;
        const roomData = await createRoom(roomName, callType);
        const roomId = roomData.room.room_id;

        // Create Token for Caller
        const callerToken = await createToken(roomId, callerId.toString(), 'participant');

        // Create Session DB
        const callSession = await CallSession.create({
            callerId,
            receiverId,
            callType,
            callStatus: "INITIATED",
            roomId,
            tokenCaller: callerToken,
            callChargePerMin: 12, // Assume flat rate or fetch from app configs
        });

        // Add to CallLog
        await CallLog.create({
            callSessionId: callSession._id,
            event: "INITIATED",
            meta: { callerId, receiverId, callType, roomId },
        });

        // Push Notification to Receiver
        // They will get the callSessionId which they will use to accept/reject
        await sendPushNotification({
            userId: receiverId,
            fcmToken: receiver.fcmToken,
            title: "Incoming Call",
            body: `${caller.name || 'Someone'} is calling you.`,
            type: "CALL",
            referenceId: callSession._id,
            data: {
                event: "RINGING",
                callSessionId: callSession._id.toString(),
                callType,
                callerName: caller.name || 'Someone',
            }
        });

        return res.status(200).json({
            success: true,
            message: "Call initiated successfully",
            data: {
                callSessionId: callSession._id,
                roomId,
                callerToken,
            }
        });
    } catch (error) {
        next(error);
    }
};

const acceptCall = async (req, res, next) => {
    try {
        const receiverId = req.userId
        const { callSessionId } = req.body;

        const callSession = await CallSession.findById(callSessionId).populate("callerId");
        if (!callSession) return throwError(404, "Call Session not found");

        if (callSession?.receiverId?.toString() !== receiverId?.toString()) {
            return throwError(403, "You are not authorized to accept this call");
        }

        if (callSession.callStatus !== "INITIATED" && callSession.callStatus !== "RINGING") {
            return throwError(400, `Call cannot be accepted. Current status is ${callSession.callStatus}`);
        }

        // Generate Token for Receiver
        const receiverToken = await createToken(callSession.roomId, receiverId.toString(), 'participant');

        callSession.callStatus = "ACCEPTED";
        callSession.tokenReceiver = receiverToken;
        callSession.startTime = new Date();
        await callSession.save();

        await CallLog.create({
            callSessionId: callSession._id,
            event: "ACCEPTED",
            meta: { receiverId },
        });

        // Notify caller that call is accepted
        // Caller FCM could be handled if required
        if (callSession.callerId.fcmToken) {
            await sendPushNotification({
                userId: callSession.callerId._id,
                fcmToken: callSession.callerId.fcmToken,
                title: "Call Accepted",
                body: "Receiver has accepted the call",
                type: "CALL",
                referenceId: callSession._id,
                data: { event: "ACCEPTED" }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Call accepted",
            data: {
                roomId: callSession.roomId,
                receiverToken,
            }
        });
    } catch (error) {
        next(error);
    }
};

const rejectCall = async (req, res, next) => {
    try {
        const receiverId = req.userId
        const { callSessionId } = req.body;

        const callSession = await CallSession.findById(callSessionId).populate("callerId");
        if (!callSession) return throwError(404, "Call Session not found");

        if (callSession.receiverId.toString() !== receiverId.toString()) {
            return throwError(403, "You are not authorized to reject this call");
        }

        if (callSession.callStatus !== "INITIATED" && callSession.callStatus !== "RINGING") {
            return throwError(400, "Call cannot be rejected now");
        }

        callSession.callStatus = "REJECTED";
        callSession.endTime = new Date();
        await callSession.save();

        await CallLog.create({
            callSessionId: callSession._id,
            event: "REJECTED",
        });

        // Notify Caller
        if (callSession.callerId.fcmToken) {
            await sendPushNotification({
                userId: callSession.callerId._id,
                fcmToken: callSession.callerId.fcmToken,
                title: "Call Rejected",
                body: "User rejected the call",
                type: "CALL",
                referenceId: callSession._id,
                data: { event: "REJECTED" }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Call rejected successfully",
        });
    } catch (error) {
        next(error);
    }
};

const endCall = async (req, res, next) => {
    try {
        const userId = req.userId
        const { callSessionId } = req.body;

        const callSession = await CallSession.findById(callSessionId);
        if (!callSession) return throwError(404, "Call session not found");

        if (callSession.callStatus === "ENDED") {
            return res.status(200).json({ success: true, message: "Call already ended" });
        }

        callSession.callStatus = "ENDED";
        callSession.endedBy = userId;
        callSession.endTime = new Date();

        // Duration and deduction logic
        if (callSession.startTime) {
            const diffSeconds = Math.floor((callSession.endTime - callSession.startTime) / 1000);
            callSession.duration = diffSeconds;

            const diffMinutes = Math.ceil(diffSeconds / 60);
            const totalAmount = diffMinutes * (callSession.callChargePerMin || 12);
            callSession.totalAmountDeducted = totalAmount;

            // Deduct from wallet
            if (totalAmount > 0) {
                await Wallet.findOneAndUpdate(
                    { userId: callSession.callerId },
                    { $inc: { "balances.INR": -totalAmount } }
                );
            }
        }
        await callSession.save();
        await CallLog.create({
            callSessionId: callSession._id,
            event: "ENDED",
            meta: { endedBy: userId, duration: callSession.duration, amount: callSession.totalAmountDeducted }
        });
        // Notify the other party if needed
        const otherPartyId = callSession.callerId.toString() === userId.toString() ? callSession.receiverId : callSession.callerId;
        const otherPartyUser = await User.findById(otherPartyId);
        if (otherPartyUser && otherPartyUser.fcmToken) {
            await sendPushNotification({
                userId: otherPartyId,
                fcmToken: otherPartyUser.fcmToken,
                title: "Call Ended",
                body: "The call was ended",
                type: "CALL",
                referenceId: callSession._id,
                data: { event: "ENDED" }
            });
        }
        return res.status(200).json({
            success: true,
            message: "Call ended successfully",
            data: {
                duration: callSession.duration,
                totalAmountDeducted: callSession.totalAmountDeducted
            }
        });
    } catch (error) {
        next(error);
    }
};

const getCallHistory = async (req, res, next) => {
    try {
        const userId = req.userId
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const calls = await CallSession.find({
            $or: [{ callerId: userId }, { receiverId: userId }]
        })
            .populate("callerId", "name image")
            .populate("receiverId", "name image")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await CallSession.countDocuments({
            $or: [{ callerId: userId }, { receiverId: userId }]
        });

        return res.status(200).json({
            success: true,
            message: "Call history fetched",
            data: calls,
            pagination: { page, limit, total }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    getCallHistory,
};
