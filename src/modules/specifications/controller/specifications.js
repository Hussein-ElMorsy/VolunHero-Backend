import userModel from "../../../../DB/models/User.model.js"



export const getUsers = async (req, res, next) => {

    let { specification } = req.params;
    specification = specification.charAt(0).toUpperCase() + specification.slice(1);
    console.log(specification);
    const users = await userModel.find({
        _id: { $ne: req.user._id },
        specification: specification,
        status: "online",
    }).select("userName role status phone profilePic specification");

    return res.status(200).json({ message: "success", users });

}

