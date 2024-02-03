import { Types } from 'mongoose'
import joi from 'joi';
const validateObjectId = (value, helper) => {
    // console.log({ value });
    // console.log(helper);
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId')
}

export const generalFields = {
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net'] }
    }).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().required(),
    id: joi.string().custom(validateObjectId),
    optionalId: joi.string().custom(validateObjectId),
    phone:joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)),
    gender: joi.string()
    .valid('Male', 'Female')
    .required(),
    address:joi.string(),
    file: joi.object({
        size: joi.number().positive(),
        path: joi.string(),
        filename: joi.string(),
        destination: joi.string(),
        mimetype: joi.string(),
        encoding: joi.string(),
        originalname: joi.string(),
        fieldname: joi.string()

    })
}



export const validation = (schema)=>{

    return (req,res,next)=>{

        const inputsData = {...req.body,...req.params,...req.query};
        if(req.file || req.files){
            inputsData.file = req.file || req.files;
        }
        console.log({inputsData});
        console.log(inputsData.mainImage);
        console.log(inputsData.file);
        console.log(inputsData.subImage);
        const validationResult = schema.validate(inputsData,{abortEarly:true});
        // console.log({validationResult});
        if(validationResult.error?.details){
            return res.status(400).json({message:"Validation Error",validationError:validationResult.error.details})
        }
        return next();

    }
    
}