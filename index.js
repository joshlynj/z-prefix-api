const app = require("./app");

const port = process.env.PORT || 8080;


const express = require('express');
const cookieParser = require('cookie-parser');
import cookie from "react-cookie";

let name = '';

app.get('/login/:name', (req, res) => {
    const opts ={
        httpOnly: true,
        secure: false
    }
    name = req.params.name;
    console.log(`User ${name} attempting login.`);
    res.cookie('loginCookie', {"userName": name}, opts);
    res.end();
})

app.use(cookieParser());

app.get('/hello', (req, res)=>{
    const cookieObj = req.cookies.loginCookie;
    // console.table(cookieObj.userName);
    res.status(200);
    res.send(`Hello ${cookieObj.userName}`)
    // console.log(cookieObj.userName);
})


// Instruct app to listen.
app.listen(port, () => {
    console.log(`API is listening to port ${port}`)
});