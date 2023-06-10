// import dependencies here
const express = require('express');
const mysql = require("mysql")
const dotenv = require('dotenv')


const app = express();

dotenv.config({path: './.env'})

//connect database
db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

// to be continued