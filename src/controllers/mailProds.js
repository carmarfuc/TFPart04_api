const { User } = require('../db.js');
const nodemailer = require("nodemailer");
const { Orders_head} = require("../db.js");

async function sendMail(status, id) {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",//"smtp.mailtrap.io",
    port: 465,//2525,
    secure: true,
    auth: {
      user: "cmf.mega01@gmail.com",//"149cf269cee26c",
      pass: "zbxl fyus dfdf wtvk",//"e272244964a996"//zbxl fyus dfdf wtvk
    },
    // debug: true, // show debug output
    // logger: true // log information in console
  });
  const body = await Orders_head.findByPk(id);

  const eMail = `<!doctype html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <style>
        .main { background-color: white; }
        a:hover { border-left-width: 1em; min-height: 2em; }
        text {font-size:5rem; font-weight:bold;}
      </style>
    </head>
    <body style="font-family: sans-serif;">
      <div style="display: block; margin: auto; max-width: 600px;" class="main">
      <img alt="Inspect with Tabs" src="https://assets-examples.mailtrap.io/integration-examples/welcome.png" style="width: 100%;">
      <p>Hola el estado de la orde número <strong>${body.id}</strong> es <strong>${body.status}</strong>.
    </body>
  </html>`;

  const mailOptopts = {
    // from:"149cf269cee26c@mailtrap.io", //@mailtrap.io
    from:"codecamp@gmail.com", //@gmail.com
    to: `${body.userEmail}`,
    subject: "Estado de la orden",
    html:eMail,
  }

  // transport.sendMail(mailOptopts, function (err, info) {
  //   if (err) {
  //     res.status(500).json({msg:err});
  //   } else {
  //     res.status(200)
  //       .json({msg:"Mail send it "+ info});
  //   }
  // });
  
}

module.exports = {
  sendMail,
}