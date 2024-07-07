import savedPostsModel from "../../../../DB/models/SavedPosts.model.js";
import postModel from "../../../../DB/models/Post.model.js";

export const getSavedPosts = async (req, res, next) => {
  const userId = req.user._id;
  let posts = await savedPostsModel.findOne({ userId: userId });
  if(posts == null){
    return res.status(200).json({ message: "success", posts: {} });
  }
  const savedPosts = await savedPostsModel.findOne({ userId: userId }).populate({
    path: 'posts.postId',
});

  const modifiedPosts = savedPosts.posts.map((post) => {
    const postObj = post.postId.toObject();
    const isLikedByMe = postObj.likes.length > 0 && postObj.likes.some(
        (like) => like.userId.toString() === userId.toString()
    );
    return {  
        _id: postObj._id,
        postId: postObj._id,
        isLikedByMe: isLikedByMe
    };
});

  posts = {
  savedPosts: {
      _id: savedPosts._id,
      userId: savedPosts.userId,
      posts: modifiedPosts,
      createdAt: savedPosts.createdAt,
      updatedAt: savedPosts.updatedAt,
      __v: savedPosts.__v
  }
};
  return res.status(200).json({ message: "success", posts });
};

export const savePost = async (req, res, next) => {
  const userId = req.user._id;
  let postId = req.params.id;
  const existedPost = await postModel.findById(postId);
  console.log(existedPost.mainPost);
  if(existedPost == null){
    return res.status(404).json({ message: "No post with this ID" });
  }
  if(existedPost.mainPost != null) postId = existedPost.mainPost;


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
    if(savedPosts.posts.length == 0){
      await savedPostsModel.findByIdAndDelete(savedPosts._id);
    }
    return res.status(200).json({ message: "success"});
  } else {
    return res.status(400).json({ message: "No saved posts found for user" });
  }
};
