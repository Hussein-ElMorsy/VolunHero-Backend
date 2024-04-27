// import {APIFeatuers} from ('./apiFeatures.js');

export const deleteOne = (Model) => async (req, res, next) => {
  let id;
  if(req.user.id){     //Modified
    id = req.user.id;
  }
  else if(req.params.id){
    id = req.params.id
  }
  if(!id) return next(new Error("No id found")) // Modification is done

  const doc = await Model.findByIdAndDelete(id);
  if (!doc) {
    return next(new Error("No Document found with this id"));
  }
  res.status(204).json({
    // 204 data is no longer exist...Don't worry post man when he sees 204 he will not show the json file it's normal
    status: "sucess",
    data: null,
  });
};

export const updateOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    //req.body is the new Object which is in this case will be the request body
    new: true, // return the new updated object...not the last one //Go mongoose to see all the quries and the documentations
    runValidators: true, // run the validations that we did
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

export const createOne = (Model) => async (req, res, next) => {
  const doc = await Model.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};

export const getOne = (Model, popOptions) => async (req, res, next) => {
  //? for optional

  let query = Model.findById(req.params.id);
  if (popOptions) query.populate(popOptions);

  const doc = await query;
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
  // To allow for nested GET reviews on tour (HACK)
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId }; // hack => Just for some path not all of them

  const features = new APIFeatuers(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination(); // Chaining because of returning the This Object
  const doc = await features.query; // if there is parameter that is not in the db so No Results 0

  //Send the Resoponse
  res.status(200).json({
    message: "sucess",
    results: doc.length, // Just to make it simple for the client(front-end)
    data: {
      doc,
    },
  });
};
