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
        enum: ['follow', 'like', 'comment'],// 'comment', 'mention', 'reply', 'share'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        // not required for followed
    },
}, {timestamps: true});

const Notifcation = mongoose.model('Notification', notificationSchema);

export default Notifcation;