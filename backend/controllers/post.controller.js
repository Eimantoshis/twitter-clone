import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import {v2 as cloudinary} from 'cloudinary';
import Notification from "../models/notification.model.js";


export const createPost = async (req, res) => {
    try {
        const {text } = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({error: "User not found"});

        if (!text && !img) {
            return res.status(400).json({error: "Post must have either text or image"});
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        });

        await newPost.save();

        res.status(201).json(newPost);
        
    } catch (error) {
        console.log("Error in createPost controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({error: "You are not authorized to delete this post"});
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Post deleted successfully"});
    } catch (error) {
        console.log("Error in deletePost controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({error: "Comment text is required"});
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }

        const comment = {user: userId, text};
        post.comments.push(comment);
        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        if (post.user.toString() !== userId.toString()) {
                // Send notification to the post owner
                const notification = new Notification({
                    type: "comment",
                    from: userId,
                    to: post.user,
                    post: postId,
                });

                await notification.save();
            }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.log("Error in commnetOnPost controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const deleteComment = async (req, res) => {
    try {
        const {postId, commentId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({error: "Comment not found"});
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({error: "You are not authorized to delete this comment"});
        }

        // Remove the comment from the post
        post.comments.pull(commentId);
        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            })
        
        res.status(200).json(updatedPost);
    } catch (error) {
        console.log("Error in deleteComment controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}


export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const {id:postId} = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike the post
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}});
            await User.updateOne({_id:userId}, {$pull: {likedPosts: postId}});
            
            const updatedLikes = post.likes.filter(id => id.toString() !== userId.toString())
            res.status(200).json(updatedLikes);
        } else {
            // Like the post
            post.likes.push(userId);
            await User.updateOne({_id:userId}, {$push: {likedPosts: postId}});

            await post.save();

            if (post.user.toString() !== userId.toString()) {
                // Send notification to the post owner
                const notification = new Notification({
                    type: "like",
                    from: userId,
                    to: post.user,
                    post: postId,
                });

                await notification.save();
            }
            const updatedLikes = post.likes
            res.status(200).json(updatedLikes);
        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller", error.message);
        res.status(500).json({error: "Internal server error"});
        
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });


        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        })

        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }
        res.status(200).json(post);
    } catch (error) {
        console.log("Error in getPost controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({error: "User not found"});

        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        return res.status(200).json(likedPosts);
    } catch (error) {
        console.log("Error in getLikedPosts controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({error: "User not found"});

        const following = user.following;

        const feedPosts = await Post.find({user: {$in: following}})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        })

        return res.status(200).json(feedPosts);


    } catch (error) {
        console.log("Error in getFollowingPosts controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const {username} = req.params;

        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        const posts = await Post.find({user: user._id})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });

        return res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getUserPosts controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}