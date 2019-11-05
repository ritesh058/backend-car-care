const mongoose = require('mongoose');
const schema = mongoose.Schema;


const carBookSchema = new schema({
    userId:{
        type:Number,
        required:true
    },
    vechileNo: {
        type: String,
        required: true
    },
    vechileType: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true,
        min: 10
    },
    serviceType: {
        type: String,
        required: true
    },
    requirement: {
        type: String,
        required: true
    },
    budgetPrice: {
        type: String,
        required: true
    },
    areaLocation: {
        type: String,
        required: true
    },
    serviceDate: {
        type: String,
        required: true
    },
    pickUp: {
        
    },
    pickupDetail: {
        pickLocation: {
            type: String,
        },
        pickupDate: {
            type: String,
        }
    }
})
let carBookingModel = mongoose.model('user_car_booking',carBookSchema);

module.exports = carBookingModel;




