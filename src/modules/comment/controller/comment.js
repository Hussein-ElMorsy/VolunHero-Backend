import mongoose from "mongoose";
import commentModel from "../../../../DB/models/Comment.model.js";
import postModel from "../../../../DB/models/Post.model.js";



export const commentPost = async (req, res, next) => {
    req.body.createdBy = req.user._id;
    const { postId } = req.params;
    req.body.postId = postId;
    const comment = await commentModel.create(req.body);


    const updatedPost = await postModel.findByIdAndUpdate(postId, {
        $push: { comments: { commentId: comment._id, } },
        $inc: { commentCount: 1 },
    },
        { new: true }
    );
    if (!updatedPost) {
        return res.status(404).json({ message: "No post with this id" });
    }
    return res.status(200).json({ message: "success", comment: comment });
}



export const getPostComments = async (req, res, next) => {

    const { postId } = req.params;
    if (! await postModel.findById(postId)) {
        return res.status(404).json({ message: "No post with this id" });
    }

    const comments = await commentModel.find({ postId });
    return res.status(200).json({ message: "success", comments });


}

export const deleteComment = async (req, res, next) => {
    const { postId, commentId } = req.params;

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        
        const existingComment = await commentModel.findOne({ postId, _id: commentId }).session(session);
        if (!existingComment) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Comment not found" });
        }

        const postOwner = await postModel.findById(postId).session(session);
        if (!postOwner) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Post not found" });
        }

        if (postOwner.createdBy.toString() !== req.user._id.toString() && existingComment.createdBy.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            return res.status(401).json({ message: "Not Authorized User" });
        }

        
        const deletedComment = await commentModel.findByIdAndDelete(commentId).session(session);
        if (!deletedComment) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Failed to delete comment" });
        }

        
      
        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { $pull: { comments: new mongoose.Types.ObjectId(commentId) }, $inc: { commentCount: -1 } },
            { new: true, session }
        );

        if (!updatedPost) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Failed to update post" });
        }

        
        await session.commitTransaction();
        res.json({ message: "Comment deleted successfully", updatedPost });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Server error", error, stack:error.stack});
    } finally {
        session.endSession();
    }
};