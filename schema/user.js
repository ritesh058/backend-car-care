const mongoose = require('mongoose');
var schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRound = 10;
const jwt = require('jsonwebtoken');
const validator = require('validator')

var userSchema = new schema({
    userName: {
        type: String
    },
    mobileNo: {
        type: Number,
        unique: true,
        required: true,
        min:10
    },
    userPassword: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        trim: true,
        validator(value) {
            if (validator.isEmail(value)) {
                return true;
            }
            else return "Invalid email-id"
        }

    },
    address: {
        type:String
    },
    pinCode: {
        type: Number,
        min: 6
    },

    tokens: [
        {
            token: {
                type: String,
                required: true
            }

        }
    ]

});

// userSignUp.pre('save',async function(next){
//     const user = this;

//     next();
// })

//To match the email and password for user
userSchema.statics.matchCredential = async (userid, password) => {
    let user = await userModel.findOne({ mobileNo: userid })
    if (!user) {
        return { "error": "Unable to login" }
    }

    const isMatch = await bcrypt.compare(password, user.userPassword)

    if (!isMatch) {
        return { "error": "Unable to login" };
    }

    return user
}

userSchema.methods.generateAuthToken = async function () {
    let user = this;
    const token = jwt.sign({ mobileNo: user.mobileNo }, "thisismysecretkey");
    user.tokens = user.tokens.concat({
        token
    })
    await user.save();
    return token;
}


var userModel = mongoose.model('user_signup', userSchema)

module.exports = userModel
