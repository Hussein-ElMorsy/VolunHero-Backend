import nodemailer from "nodemailer";

const sendEmail=async({to,cc,bcc,html,subject,text,attachments = []}={})=>{

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user:process.env.EMAIL,
    pass:process.env.EMAIL_PASSWORD,
  },
});

  const info = await transporter.sendMail({
    from:`"VolunHero" <${process.env.EMAIL}>`, // sender address
    to, // list of receivers
    cc,
    bcc,
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
  
  return info.rejected.length ? false : true
  

}

export default sendEmail