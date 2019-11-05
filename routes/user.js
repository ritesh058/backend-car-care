const express = require('express');
const router =express.Router();
const userDatabaseCall = require('../database-mongoose/user');
const auth = require('./auth_token')

router.post('/usersignup', (req, res) => {
    userDatabaseCall.register(req,res);
})

router.post('/usersignin', (req, res) => {
    userDatabaseCall.userLogin(req,res);
})

router.post('/userupdate',auth,(req,res)=>{
    userDatabaseCall.userUpdate(req,res);
})

router.get('/userData',auth,(req,res)=>{
    userDatabaseCall.userData(req,res);
})
router.post('/user-car-booking',auth,(req,res)=>{
    userDatabaseCall.carBooking(req,res)
})
router.get('/usercarbookinghistory',auth,(req,res)=>{
    userDatabaseCall.getAllBookingHistory(req,res)
})

router.get('/bookingById',auth,(req,res)=>{
    userDatabaseCall.getBookingHistoryById(req,res)
})
router.delete('/deleteuserbooking',auth,(req,res)=>{
    userDatabaseCall.deleteBookingById(req,res)
})
router.post('/changePassword',auth,(req,res)=>{
    userDatabaseCall.changePassword(req,res)
})
router.put('/logout',auth,(req,res)=>{
    userDatabaseCall.logoutUser(req,res)
})

module.exports=router