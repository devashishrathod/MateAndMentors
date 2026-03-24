const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: String,
    message: String,
    type: {
        type: String,
        enum: ["CALL", "CHAT", "OTHER"],
        default: "CALL",
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CallSession",
    },
    isRead: { type: Boolean, default: false, },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Notification", notificationSchema);