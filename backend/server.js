const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require('cors')
const app = express();
const port = 3000;

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

app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email already exists in the database
  const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(emailCheckQuery, [email], (error, results) => {
    if (error) {
      console.error('Error checking email: ' + error);
      res.status(500).json({ error: 'Error checking email' });
      return;
    }

    if (results.length > 0) {
      // The email already exists, return an error message
      res.status(400).json({ error: 'Email already exists' });
    } else {
      // Email doesn't exist, proceed with user registration
      const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, email, password], (err, result) => {
        if (err) {
          console.error('Error inserting user data: ' + err);
          res.status(500).json({ error: 'Error signing up' });
        } else {
          res.json({ message: 'Signup successful' });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
