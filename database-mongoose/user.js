const User = require('../schema/user.js');
const bcrypt = require('bcrypt');
const saltRound = 10;
const UserBookingModel = require('../schema/userBooking');
const sendMail = require('../shared/nodemailer')





exports.register = (req, res) => {
    let reqBody = req.body;

    if (reqBody.matchingPassword.password == reqBody.matchingPassword.confirmPassword) {
        bcrypt.hash(reqBody.matchingPassword.password, saltRound).then(function (hash) {

            var newUser = new User({
                userName: reqBody.userName,
                userPassword: hash,
                mobileNo: reqBody.mobileNo
            });

            newUser.save((error, data) => {
                if (error) {
                    if (error.code == 11000) {
                        res.status(400).json({ "err": "Mobile number already exists..Try another number" })
                    }
                    else {
                        res.status(400).json({ "err": "Unkown Error..Contact Administrator" })
                    }
                }
                else {
                    sendMail.contact(req, res);
                    res.status(201).json({ "msg": "Data saved successfully" });

                }
            });

        });
    }
}

exports.userLogin = async (req, res) => {
    debugger;
    try {
        let user = await User.matchCredential(req.body.userId, req.body.password);
        debugger;
        if (!user.error) {
            let token = await user.generateAuthToken();
            res.status(201).json({ user, token });
        }
        else
            res.status(400).json({ "err": "Invalid User Id and Password" });
    }
    catch (error) {
        debugger;
        console.log(error);
    }

}

exports.allUserData = (req, res) => {
    console.log("reached")
}

exports.userData = (req, res) => {
    try {
        res.status(201).json({ "data": req.user })
    }
    catch (e) {
        res.status(400).json({ "error": "Could not fetch any data" })

    }

}

exports.userUpdate = (req, res) => {

    try {
        let updateduser = User.findByIdAndUpdate({ "_id": req.user._id }, req.body, (error, data) => {
            if (error) {
                res.status(400).json({ "error": "Please check the data before updating..." });
            }
            if (data) {
                res.status(201).json({ "msg": true });
            }
        });

    }
    catch (e) {
        res.status(400).json({ "error": "Please update the data in the given format" });
    }
}

exports.carBooking = (req, res) => {
    let bookingData = req.body;
    bookingData.userId = req.user.mobileNo;
    let newBooking = new UserBookingModel(bookingData)
    newBooking.save((error, data) => {
        if (data) {
            res.status(201).json({ 'msg': "Booking for car-care has been raised succefully" });
        }
        else {
            res.status(400).json({ 'err': "Booking for car-care encountered an error" });
        }
    })
}

exports.getAllBookingHistory = (req, res) => {
    UserBookingModel.find({ userId: req.user.mobileNo }, (error, data) => {
        if (error) {
            res.status(400).json({ 'err': 'Try after some-time' })
        }
        else {
            let dataArray = [];
            for (let eachData of data) {
                let eachObj = {};
                eachObj.vechileNo = eachData.vechileNo;
                eachObj.budgetPrice = eachData.budgetPrice;
                eachObj.serviceDate = eachData.serviceDate;
                eachObj._id = eachData._id;
                dataArray.push(eachObj)
            }

            res.status(201).json({ data: dataArray })
        }
    })

}

exports.getBookingHistoryById = (req, res) => {
    if (req.query) {
        UserBookingModel.findById(req.query._id, (error, data) => {
            if (error) {
                res.status(400).json({ "err": "Unable to fetch any details...Try again" })
            }
            if (data) {
                res.status(201).json(data);
            }
        })
    }
}
exports.deleteBookingById = (req, res) => {
    try {
        if (req.query) {
            UserBookingModel.deleteOne({ _id: req.query._id }, (error, data) => {
                if (error) {
                    res.status(400).json({ "err": "Unable to delete any details...Try again" })
                }
                if (data) {
                    res.status(201).json({ "msg": true });
                }
            })
        }
    }
    catch (error) {

    }
}

exports.changePassword = async (req, res) => {
    console.log(req.body);
    if (req.body) {
        const isMatch = await bcrypt.compare(req.body.userPassword, req.user.userPassword);
        if (isMatch) {
            res.status(400).json({ "err": "New Password and Old Password cannot be same" });
        }
        else {
            bcrypt.hash(req.body.userPassword, saltRound).then(function (hash) {

                try {
                    let updateduser = User.findByIdAndUpdate({ "_id": req.user._id }, { userPassword: hash }, (error, data) => {
                        if (error) {
                            res.status(400).json({ "err": "Please check the data before updating..." });
                        }
                        if (data) {
                            res.status(201).json({ "msg": true });
                        }
                    });

                }
                catch (e) {
                    res.status(400).json({ "err": "Please contact the administrator" });
                }
            });
        }
    }
}

exports.logoutUser = async (req, res) => {

    let allToken = req.user.tokens;
    let activeToken = (req.headers.authorization).replace("Bearer ", "")
    let activeLogin = allToken.filter(eachToken => {

        if (!(eachToken.token == activeToken)) {
            return eachToken.token
        }
    })

    allToken = activeLogin;

    if (allToken) {

        User.findByIdAndUpdate({ "_id": req.user._id }, {"tokens":allToken}, (error, data) => {
            if (error) {
                console.log(error)
            }
            else {
                res.status(201).json({"msg":"User Logout"})
            }
        })

    }



}

