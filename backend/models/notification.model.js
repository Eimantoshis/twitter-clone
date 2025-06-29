import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['follow', 'like'],// 'comment', 'mention', 'reply', 'share'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

const Notifcation = mongoose.model('Notification', notificationSchema);

export default Notifcation;