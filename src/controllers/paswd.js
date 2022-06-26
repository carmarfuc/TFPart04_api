const { User } = require('../db.js');
const nodemailer = require("nodemailer");

function sendMail(req, res) {
  const { mail }= req.params;
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",//"smtp.mailtrap.io",
    port: 465,//2525,
    secure: true,
    auth: {
      user: "cmf.mega01@gmail.com",
      pass: "zbxl fyus dfdf wtvk",
    }});
// https://tf-henry-04-02.herokuapp.com
  const eMail = `<!doctype html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body style="font-family: sans-serif;">
      <div style="display: block; margin: auto; max-width: 600px;" class="main">
      <img alt="Inspect with Tabs" src="https://assets-examples.mailtrap.io/integration-examples/welcome.png" style="width: 100%;">
      <p>Hi, click on the below link to change your password.</p>
      <a href="https://tfp-art04-client.vercel.app/password/supersecreturl/${mail}">RESTORE PASSWORD</a>
      <p>If your email is not ${mail}, ignore this message.</p>
        <p>Good luck! Hope it works.</p>
      <style>
        .main { background-color: white; }
        a:hover { border-left-width: 1em; min-height: 2em; }
      </style>
    </body>
  </html>`;

  const mailOptopts = {
    // from:"149cf269cee26c@mailtrap.io", //@mailtrap.io
    from:"codecamp@gmail.com",
    to: `${mail}`,
    subject: "Change password",
    html:eMail,
  }

  transport.sendMail(mailOptopts, function (err, info) {
    if (err) {
      // res.status(500)
      //   .json({msg:err});
    } else {
      // res.status(200)
      //   .json({msg:"Mail send it "+ info});
    }
  });
  
}

async function changePassword(req, res) {
  const {mail, password} = req.params;
  const ok = await User.findByPk(mail);

  if(ok === null){
    res.status(500)
       .send({msg: 'Check password or email'});
  }else{
    try {
      await User.upsert({
        email:mail,
        password:password,
      });
      res.status(200)
         .send({msg: "ok"})
    } catch (error) {
      res.status(500).json({msg:error})
    }
  }

}

module.exports = {
  sendMail,
  changePassword,
}