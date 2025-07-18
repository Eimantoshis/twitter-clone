import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({to: userId})
        .populate({
            "path": "from",
            select: "username profileImg"
        })
        .sort({createdAt: -1});; // Newest first

        await Notification.updateMany({to:userId}, {read: true});



        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications controller", error.message);
        res.status(500).json({error: "Internal server error"});
        
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        // Maybe make it delete all READ notifications?
        const userId = req.user._id;
        await Notification.deleteMany({to:userId});

        res.status(200).json({message: "Notifications deleted successfully"});
    } catch (error) {
        console.log("Error in deleteNotifications controller", error.message);
        res.status(500).json({error: "Internal server error"});
        
    }
}

export const getUnreadCount = async (req,res) => {
    try {
        const count = await Notification.countDocuments({
            to: req.user._id,
            read: false
            });
        res.status(200).json({count});
    } catch (error) {
        console.log("Error in getUnreadCount controller", error.message);
        res.status(500).json({error: "Internal server error"});
        
    }
}

