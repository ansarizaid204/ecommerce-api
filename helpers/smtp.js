
const nodemailer = require("nodemailer");
const config = require("../config/config");


let transporter;





  transporter = nodemailer.createTransport({
    pool:true,
    service: "gmail",
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.ssl, // true for 465, false for other ports
    auth: {
      user: config.mail.username, // generated ethereal user
      pass: config.mail.password, // generated ethereal password
    },
  });




 




  module.exports = transporter;