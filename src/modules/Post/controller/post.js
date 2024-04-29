import postModel from "../../../../DB/models/Post.model.js";

export const createPost = async (req, res, next) => {
  const doc = await postModel.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};

export const updatePost = async (req, res, next) => {
  const doc = await postModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new Error(`No post Found with this id`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};

export const getPost = async (req, res, next) => {
  let query = postModel.findById(req.params.id);
  if (popOptions) query.populate(popOptions);

  const doc = await query;

  if (!doc) {
    return next(new Error(`No doc Found with this id`, 404));
  }
  res.status(200).json({
    message: "success",
    requestedAt: req.requestTime,
    data: {
      doc,
    },
  });
};

export const deletePost = async (req, res, next) => {
  let id;
  if (req.params.id) {
    id = req.params.id;
  }
  if (!id) return next(new Error("No id found")); // Modification is done

  const doc = await postModel.findByIdAndDelete(id);
  if (!doc) {
    return next(new Error("No Document found with this id"));
  }
  res.status(204).json({
    status: "sucess",
    data: null,
  });
};
