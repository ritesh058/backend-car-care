var nodemailer = require('nodemailer');
//hello

exports.contact = function (req, res) {
    var from = "riteshmsec@gmail.com";
    var to = req.body.emailId;
    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "riteshmsec@gmail.com",
            pass: "006t1028"
        }
    });

    var mailOption = {
        from: from,
        to: to,
        subject: `${req.body.userName} Welcome to e-commerce website`,
        text: "We are plased to serve you and for any query contact admin for better technical support",
    }

    smtpTransport.sendMail(mailOption, (error, data) => {
        if (error) {
            console.log("Error while sending mail")
        }
    });


}