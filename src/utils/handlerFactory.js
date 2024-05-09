import {ApiFeatures} from './apiFeatures.js';

export const deleteOne = (Model) => async (req, res, next) => {
  let id;
  if(req.params.id){
    id = req.params.id
  }
  if(!id) return next(new Error("No id found")) // Modification is done

  const doc = await Model.findByIdAndDelete(id);
  if (!doc) {
    return next(new Error("No Document found with this id"));
  }
  res.status(204).json({
    status: "sucess",
    data: null,
  });
};

export const updateOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true, 
    runValidators: true,
  });
  if (!doc) {
    return next(new Error(`No document Found with this id`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};

export const createOne = (Model) => async (req, res, next) => { // Hashing password issue..Necessary ?
  const doc = await Model.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};

export const getOne = (Model, popOptions) => async (req, res, next) => {

  let query = Model.findById(req.params.id);
  if (popOptions) query.populate(popOptions);

  req.query.fields = "-password,-status,-confirmEmail,-forgetCode,-changePasswordTime,-createdAt"
  const features = new ApiFeatures(query, req.query).select()

  const doc = await features.mongooseQuery;


  // console.log()
  // Model.findOne({_id: req.params.id})
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

export const getAll = (Model) => async (req, res, next) => {
  let filter = {};
  // if (req.params.) filter = { tour: req.params. }; 
  const features = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .select()
    .paginate()
    .select();
    // .paginate(); 


  const doc = await features.mongooseQuery; 

  res.status(200).json({
    message: "sucess",
    results: doc.length, 
    data: {
      doc,
    },
  });
};
