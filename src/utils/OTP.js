// const otpGenerator = require('otp-generator');

import otpGenerator from 'otp-generator'

export const generateOTP = () =>{
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
}
