const nodemailer = require('nodemailer');// import nodemailer
const SibApiV3Sdk = require('sib-api-v3-sdk');


exports.generateOPT = (otp_len= 6 ) => {

  let OTP = ""
  for (let i = 1; i <= otp_len; i++) {
      randnum = Math.round(Math.random() * 9)
      OTP += randnum
  }
  return OTP
}

exports.generateMailTransporter = () => 
     nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.EMAILUSER,
          pass: process.env.EMAILPASS
        }
      });

exports.sendEmail = async (email, name, subject, htmlContent) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;

  // Configure API key authorization: api-key
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API;

  // Uncomment below two lines to configure authorization using: partner-key
  // var partnerKey = defaultClient.authentications['partner-key'];
  // partnerKey.apiKey = 'YOUR API KEY';

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = {name: "Woke Advisory", email: process.env.OFFICIAL_EMAIL};
  sendSmtpEmail.to = [{email, name}];
  

  // sendSmtpEmail = {
  //     to: [{
  //         email: 'testmail@example.com',
  //         name: 'John Doe'
  //     }],
  //     templateId: 59,
  //     params: {
  //         name: 'John',
  //         surname: 'Doe'
  //     },
  //     headers: {
  //         'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
  //     }
  // };

  return  await apiInstance.sendTransacEmail(sendSmtpEmail)
}