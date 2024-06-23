import donationFormModel from "../../../../DB/models/DonationForm.model.js";
import userModel from "../../../../DB/models/User.model.js";


export const createDonationForm = async (req, res, next) => {

  req.body.createdBy = req.user._id;
  const donationForm = await donationFormModel.create(req.body)
  return res.status(200).json({ message: "success",  donationForm});
};

export const getAllDonationForms = async(req, res, next) => {
  const donationForms = await donationFormModel.find().sort({ createdAt: -1 });
  return res.status(200).json({message: "success", donationForms});
}

export const getDonationFormOfSpecificOrg = async(req, res, next) => {
  const orgId = req.params.id;
  const org = await userModel.findById(orgId);

  if(org == null || org.role != 'Organization'){
    throw next(new Error("No organization with this id", { cause: 404 }));
  }

  const donationForms = await donationFormModel.find({
    createdBy: orgId
  }).sort({ createdAt: -1 });

  return res.status(200).json({message: "success", donationForms});
}


export const getDonationForm = async (req, res, next) => {
  const donationFormId = req.params.id;
  const donationForm = await donationFormModel.findById(donationFormId);
  if(donationForm == null){
    throw next(new Error("No donation form with this id", { cause: 404 }));
  }
  return res.status(200).json({message: "success", donationForm});
}

export const updateDonationForm = async (req, res, next) => {
  const { id } = req.params;
  const checkOrgForm = await donationFormModel.findOne({
    createdBy: req.user._id,
    _id: id,
  });

  if (!checkOrgForm) return next(new Error("In-valid donation form")); 

  const updatedDonationForm = await donationFormModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({message: "success", updatedDonationForm});
}

export const deleteDonationForm = async (req, res, next) => {
  const { id } = req.params;
  const checkOrgForm = await donationFormModel.findOne({
    createdBy: req.user._id,
    _id: id,
  });

  if (!checkOrgForm) return next(new Error("In-valid donation form")); 

  const doc = await donationFormModel.findByIdAndDelete(id);
  if (!doc) {
    return next(new Error("No Document found with this id"));
  }
  return res.status(204).json({ message: "success" });
};
