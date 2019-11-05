const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/car-care',{ useNewUrlParser: true,useUnifiedTopology: true },(error,data)=>{
    if(error){
        console.log("There is an error while connecting to database")
    }
    else{
        console.log("Connected to Database")
    }
});

const userRoutes  = require('./routes/user.js');

let port = 4000;

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,object_id, Content-Length, X-Requested-With');
    next();
});

app.use(userRoutes);








app.listen(port, () => {
    console.log(`Server Running on ${port}`)
})