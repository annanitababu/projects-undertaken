const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',    // Replace with your database host
    user: 'root',         // Replace with your MySQL username
    password: '',         // Replace with your MySQL password
    database: 'votingsystem' // Replace with your database name
});

// API to get voter details
app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM voterdetails where username = ? and password = ?';

    db.query(sql, [req.body.email,req.body.password], (err, data) => {
        if (err) return res.json("Error");
        if (data.length > 0) {
            //return res.json('Login Successfully !!!'); 
            return res.status(200).json({ 
                success: true, 
                message: "Login successful" ,
                voteraddr: data[0].VoterAddr // Include Voteraddr in the response
              });
        } else {
            //return res.json("No Record !!");
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
              });
        }
    
    });

});

app.listen(8081, () => {
    console.log(`listening`);
});
 