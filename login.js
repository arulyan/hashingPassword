const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require('cors');
const bcrypt = require('bcrypt');
const logger = require('morgan');
app.use(cors());
app.use(logger('dev'));
//the above code is used for importing the respective libraries that we r going to use here!

app.use(bodyparser.urlencoded({ extended: false })); //req goes to the server in this encoded form
app.use(bodyparser.json()); //res data should be json format

const mysql = require("mysql"); //so if i hover over "mysql" i can see from where it's getting
// imported but if i write "asdfmysql" it doesnt shows its location, that means the module does not exist

//making connection with the mysql database
const connection = mysql.createConnection({
    host: "localhost",
    user: "forza",
    password: "forza",//lets do some trials overhere in this section after everything is working
    database: "login"
})

//LOGIN
app.post("/login", (req, res) => {
    const email = req.body.email;
    const pass = req.body.pas;
    var sql = 'select * from secret where Email=?';
    connection.query(sql, [email], (err, results) => { //(err,results,fields)=>{} is a call back function #New way of writing functions
        if (err) {
            console.log(err);
            res.json({
                success: false,
                status: 400
            })
        }
        else if (results.length) {
            const hash = results[0].Password;
            bcrypt.compare(pass, hash, (err, resp)=> {
                if (resp) {
                    res.json(results);
                    console.log("success");
                }
                else {
                    res.json({
                        success: false,
                        status: 499
                    })
                    console.log("Invalid Password " + hash + ' ' + pass+' '+resp);
                }
            })
        }
        else {
            res.json({
                success: false,
                status: 450
            })
        }
    })
})

//REGISTER
app.post("/signup", (req, res) => {
    const newmail = req.body.email;
    const pass = req.body.passw;
    let sql = 'select * from secret where Email=?';
    connection.query(sql, [newmail], (err, results) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                status: 401
            })
        }
        if (results.length) {
            console.log("You have already Registered!");
            res.json({
                success: false,
                status: 410
            })
        }
        else {
            bcrypt.hash(pass, 10, function (err, hash) {
                var shit = 'insert into secret (Email,password) values (?,?)';
                connection.query(shit, [newmail, hash], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({
                            success: false,
                            status: 402
                        })
                    }
                    else {
                        res.json({
                            success: true,
                            status: 200
                        })
                        console.log("You are Registered!")
                    }
                })
            })
        }
    })
})

app.listen(process.env.PORT || 5000);