const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require('cors')
const app = express();
const port = 3000;
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tiger",
  database: "job_portal",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err);
    return;
  }
  console.log("Connected to MySQL");
});


// signup api
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email already exists in the database
  const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(emailCheckQuery, [email], (error, results) => {
    if (error) {
      console.error('Error checking email: ' + error);
      res.status(500).json({ status:'red',error: 'Error checking email' });
      return;
    }

    if (results.length > 0) {
      // The email already exists, return an error message
      res.status(400).json({ status:'red',error: 'Email already exists' });
    } else {
      // Email doesn't exist, proceed with user registration
      const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, email, password], (err, result) => {
        if (err) {
          console.error('Error inserting user data: ' + err);
          res.status(500).json({ error: 'Error signing up' });
        } else {
          res.json({status:'green',message: 'Signup successful' });
        }
      });
    }
  });
});

// login api
app.post('/api/login', (req, res) => {
  const {email, password } = req.body;

  // Check if the email already exists in the database
  const emailCheckQuery = 'SELECT id FROM users WHERE email = ? and password = ?';
  db.query(emailCheckQuery, [email,password], (error, results) => {
    if (error) {
      console.error('Error checking email: ' + error);
      res.status(500).json({ status:'red',error: 'Error checking email' });
      return;
    }

    if (results.length > 0) {

      // The email already exists, return an error message
      res.status(200).json({ status:'green',message: 'Login Successfully',data:results[0].id});
    } else {
      // Email doesn't exist, proceed with user registration
      res.status(400).json({ status:'red',error: 'User not found'});

    }
  });
});


// get all active jobs method
app.get('/api/jobs', (req, res) => {
  const { page, perPage } = req.query;
  const offset = (page - 1) * perPage;

  const getJobsQuery = `SELECT * FROM job_master WHERE status = 'active' LIMIT ${perPage} OFFSET ${offset}`;

  db.query(getJobsQuery, (error, results) => {
    if (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Error fetching jobs' });
      return;
    }

    res.json({status:'green',data:results});
  });
});


app.post('/api/applyJob',upload.single('file'),async(req, res) => {

  const {file,body} = req;
  try {

    const fileData = await fs.promises.readFile(file.path);

    const otherParam = JSON.parse(body.other_params);
    console.log(otherParam)
    const insertQuery = 'INSERT INTO job_applications (job_id,user_id,base64_data,filename) VALUES (?,?,?,?)';
    db.query(insertQuery, [otherParam.job_id,otherParam.user_id,fileData,otherParam.filename], (err, result) => {
        if (err) {
          console.error('MySQL error:', err);
          res.status(500).json({ message: 'Error adding data to the database' });
        } else {
          res.json({ status:'green',message: 'Data added to the database' });
        }
      });
  } catch (error) {
    console.error('Error uploading the file:', error);
    res.status(500).json({ message: 'Error uploading the file.' });
  }


});


app.get('/api/applied_jobs', (req, res) => {

  const {user_id} = req.query

  const getJobsQuery = `SELECT job_id FROM job_applications WHERE user_id = ${user_id}`;

  db.query(getJobsQuery, (error, results) => {
    if (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Error fetching jobs' });
      return;
    }

    res.json({status:'green',data:results});
  });
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
