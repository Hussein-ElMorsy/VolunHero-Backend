import savedPostsModel from "../../../../DB/models/SavedPosts.model.js";
import postModel from "../../../../DB/models/Post.model.js";

export const getSavedPosts = async (req, res, next) => {
  const userId = req.user._id;
  const posts = await savedPostsModel.find({ userId: userId });
  return res.status(200).json({ message: "success", savedPosts: posts });
};

export const savePost = async (req, res, next) => {
  const userId = req.user._id;
  const postId = req.params.id;
  const existedPost = await postModel.findById(postId);
  if(existedPost == null){
    return res.status(404).json({ message: "No post with this ID" });
  }

  let savedPosts = await savedPostsModel.findOne({ userId: userId });
 
  if (savedPosts) {
    const postExists = savedPosts.posts.some((p) => p.postId == postId);

    if (postExists) {
      return res.status(400).json({ message: "Post already saved" });
    }

    savedPosts.posts.push({ postId: postId });
    await savedPosts.save();
    return res.json({ message: "success", posts: savedPosts });
  } else {
    savedPosts = new savedPostsModel({
      userId: userId,
      posts: [{ postId: postId }],
    });

    await savedPosts.save();
    return res.status(200).json({ message: "success", posts: savedPosts });
  }
};


export const deleteSavedPost = async (req, res, next) => {
  const userId = req.user._id;
  const postId = req.params.id;

  let savedPosts = await savedPostsModel.findOne({ userId: userId });

  if (savedPosts) {
    const postExists = savedPosts.posts.some(
      (p) => p.postId.toString() === postId
    );

    if (!postExists) {
      return res.status(400).json({ message: "Post not found in saved posts" });
    }

    savedPosts = await savedPostsModel.findByIdAndUpdate(
      savedPosts._id,
      {
        $pull: { posts: { postId: postId } },
      },
      { new: true }
    );

    return res.status(200).json({ message: "success", posts: savedPosts });
  } else {
    return res.status(400).json({ message: "No saved posts found for user" });
  }
};
