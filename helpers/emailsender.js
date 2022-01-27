const nodemailer = require('nodemailer');

const sendAnEmail = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICES,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: `"TutorialExG" <${process.env.EMAIL}>`, // sender address
      to: toEmail, // list of receivers
      subject: 'Resseting Password', // Subject line
      text: `your one time password`, // plain text body
      html: `<b>your one time password is : ${otp}</b>`, // html body
    });
    // return info;
    // logger.info(info.messageId);
    return info.messageId;
  } catch (error) {
    // console.log(error.message);
    return error.message;
  }
};

module.exports = sendAnEmail;
