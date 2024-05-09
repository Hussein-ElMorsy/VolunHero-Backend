import { customAlphabet, customRandom, nanoid } from "nanoid";
import userModel from "../../../../DB/models/User.model.js";
import { sendEmail, generateEmailHTML } from "../../../utils/email.js";
import { generateToken, verifyToken } from "../../../utils/generateAndVerifyToken.js";
import { compare, hashText } from "../../../utils/hashAndComare.js";
import cloudinary from "../../../utils/coudinary.js"
import slugify from "slugify";

export const getAuthModule = (req, res, next) => {

    return res.json({ message: "auth module" });
}

export const signUp = async (req, res, next) => {
    const { email } = req.body;

    let role = req.body.role || "User";
    // console.log(req.body);
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (user) {
        return next(new Error("Email already existed", { cause: 409 }));
    }


    const token = generateToken({ payload: { email }, expiresIn: 60 * 5, signature: process.env.EMAIL_TOKEN })
    // console.log(token)
    // const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`
    const link = `${req.protocol}://${req.headers.host}/api/auth/confirmEmail/${token}`

    const refreshToken = generateToken({ payload: { email }, expiresIn: 60 * 60 * 24 * 30, signature: process.env.EMAIL_TOKEN })
    const refreshLink = `${req.protocol}://${req.headers.host}/api/auth/newConfirmEmail/${refreshToken}`

    const html = generateEmailHTML(link, refreshLink);

    // if (!sendEmail({ to: email, subject: "Email Confirmation", html })) {
    //     return next(new Error("Rejected Email", { cause: 400 }));
    // }
    // console.log("ddasds");
    const hashPassword = hashText({ plaintext: req.body.password });
    req.body.password = hashPassword;
    // console.log(req.body.password);
    // console.log(req.body)

    console.log(req.files);
    if(req?.files?.profilePic){
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.profilePic[0].path, { folder: `${process.env.APP_NAME}/user` })
        req.body.profilePic = { secure_url, public_id };
    }
    

    req.body.attachments = [];
    if (req?.files && req?.files?.attachments) {

        if (role == "User" && (req.body?.specification == "Medical" || req.body?.specification == "Educational")) {
            await Promise.all(req.files.attachments.map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/attachments/${nanoid()}/attachment` });
                req.body.attachments.push({ secure_url, public_id });
            }));
        }
        else if (role == "User" && req.body?.specification == "General") {
            throw new Error("Attatchments for Medical and Educational only", { statusCode: 400 });
        }
        else {
            console.log(req.files.attachments);
            for (const file of req.files.attachments) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/attachments/${nanoid()}/attachment` });
                req.body.attachments.push({ secure_url, public_id });
            }
        }
    }
    else {
        if ((role == "User" && (req.body?.specification == "Medical" || req.body?.specification == "Educational")) || role == "Organization")
            throw new Error("Attatchments required", { statusCode: 400 });

    }
    // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk");
    // console.log(req.body);
    req.body.slugUserName = slugify(req.body.userName, '-');
    const newUser = await userModel.create(req.body);
    return res.status(201).json({ message: "success", newUser });

}


export const confirmEmail = async (req, res, next) => {
    const { token } = req.params;
    const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
    if (!email) {
        return next(new Error("In-valid token payload", { cause: 400 }));
    }
    const user = await userModel.findOneAndUpdate({ email: email.toLowerCase() }, { confirmEmail: true });
    return user.modifiedCount ? res.json({ message: "success" }).status(200) : res.json.send("Not register account").status(404);

}

export const newConfirmEmail = async (req, res, next) => {

    const { token } = req.params;
    const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
    if (!email) {
        return next(new Error("In-valid token payload", { cause: 400 }));
    }
    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) {
        return next(new Error("Not register account", { cause: 400 }));
    }

    if (user.confirmEmail) {
        return res.status(200).json("Email already confirmed before")
    }

    const newToken = generateToken({ payload: email, signature: process.env.EMAIL_TOKEN, expiresIn: 60 * 2 });
    const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${newToken}`;
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`;
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    <td>
    <br>
    <br>
    <br>
    <a href="${refreshLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Send New Verification</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`

    if (!await sendEmail({ to: email, subject: "Confirm Email", html })) {
        return next(new Error("Rejected Email", { cause: 400 }))
    }
    return res.status(200).message(`<p>Done Please check your email</p>`);

}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
        return next(new Error("Not registered acount", { coase: 400 }));
    }

    if (!user.confirmEmail) {
        return next(new Error("Email not confirmed", { coase: 400 }));
    }

    if (!compare({ plaintext: password, hashValue: user.password })) {
        return next(new Error("In-valid email or password", { coase: 400 }));
    }
    console.log(req.body)
    const access_token = generateToken({ payload: { _id: user._id, role: user.role }, expiresIn: 60 * 30 });
    const refresh_Token = generateToken({ payload: { _id: user._id, role: user.role }, expiresIn: 60 * 60 * 24 * 356 });
    user.status = "online";
    await user.save();
    return res.status(200).json({ message: "success", access_token, refresh_Token })

}


export const sendCode = async (req, res, next) => {
    const { email } = req.body;
    const forgetId = customAlphabet("123456789", 4);
    const forgetCode = forgetId();
    const user = await userModel.findOneAndUpdate({ email: email.toLowerCase() }, { forgetCode }, { new: true });

    if (!user) {
        return next(new Error("Not register account", { cause: 404 }));
    }
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Forget Password</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${forgetCode}</p>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`


    if (!await sendEmail({ to: email, status: "Forget Password", html })) {
        return next(new Error("Email rejected", { cause: 404 }));
    }


    return res.status(200).json({ message: "success", user });






}


export const forgetPassword = async (req, res, next) => {

    const { email, code, password } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
        return next(new Error("Not register account", { cause: 404 }));
    }

    if (user.forgetCode != code || !code) {
        return next(new Error("code is not correct", { cause: 404 }));
    }

    user.password = hashText({ plaintext: password });
    user.forgetCode = null;
    user.changePasswordTime = Date.now()
    await user.save();
    return res.status(200).json({ message: "success", user });
}

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }


    if (!token) {
        return next(new Error("Please login first", { cause: 401 }));
    }

    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); await  promisify ???? 
    const decoded = verifyToken({ token });
    const existedUser = await userModel.findById(decoded._id);
    if (!existedUser) {
        return next(new Error("This user doest not longer exist", { cause: 401 }));
    }

    // // 4) Check if user changed password after the token was issued
    // if(existedUser.changedPasswordAfter(decoded.iat)){
    //     return next(new AppError(`User changed the password...please login again`, 401));
    // }


    req.user = existedUser; // 
    res.locals.user = existedUser;
    next();
};