const { admin, isFirebaseInitialized } = require('../configs/firebase');
const Notification = require('../models/Notifications');

const sendPushNotification = async ({ userId, fcmToken, title, body, data = {}, type = "CALL", referenceId }) => {
    try {
        // Log notification to DB
        if (userId) {
            await Notification.create({
                userId,
                title,
                message: body,
                type,
                referenceId,
            });
        }

        if (!isFirebaseInitialized || !fcmToken) {
            console.warn('Push notification skipped: Firebase not initialized or FCM token missing');
            return null;
        }

        const message = {
            notification: {
                title,
                body,
            },
            data,
            token: fcmToken,
        };

        const response = await admin.messaging().send(message);
        console.log('Successfully sent push notification:', response);
        return response;
    } catch (error) {
        console.error('Error sending push notification:', error.message);
        return null;
    }
};

module.exports = {
    sendPushNotification,
};
