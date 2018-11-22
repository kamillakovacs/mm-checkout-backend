'use strict'

require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

conn.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Connection to DB established`);
});

app.use('/assets', express.static('assets'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended : false }));

app.post('/feedback', jsonParser, (req, res) => {
  let rating = req.body.rating;
  let feeling = req.body.feeling;
  let finished = req.body.finished;
  let energy = req.body.energy;
  let favorite = req.body.favorite;
  let feedback = req.body.feedback;
  let hardest = req.body.hardest;
  let is_relevant = req.body.is_relevant;
  let whatlearned = req.body.whatlearned;
  // let channel = req.body.channel;
  // let username = req.body.username;
  // let created_at = req.body.created_at;

  let token = req.body.token;
  let mmToken = 1111;

  if (token === mmToken) {
    if (rating && feeling && finished && energy) {
      conn.query(`INSERT INTO checkout (rating, feeling, finished, energy) values (?, ?, ?, ?);`, [rating, feeling, finished, energy], (err, result) => {
        if (err) {
          console.log(`Database error POST`);
          res.status(500).send(err.message);
          return;
        } else {
          res.status(200).json({
            result,
          })
        }
      })
    }
  } else {
    console.log(`Invalid authentication`);
    res.status(400).send(err.message);
    return;
  }
})

module.exports = app;