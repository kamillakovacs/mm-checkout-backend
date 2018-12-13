'use strict'

const express = require('express'),
  app = express(),  
  mysql = require('mysql'),
  path = require('path'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json();

const conn = mysql.createConnection({
  host: 'mattermostdb.caklgmbaggid.eu-central-1.rds.amazonaws.com',
  user: 'mattermostdb',
  password: 'mattermost',
  database: 'mattermost',
  port: 3306
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
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const incoming = req.body;
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/feedback', jsonParser, (req, res) => {
  const rating = Object.values(req.body.data)[0],
    feeling = Object.values(req.body.data)[1],
    finished = Object.values(req.body.data)[2],
    energy = Object.values(req.body.data)[3],
    favorite = Object.values(req.body.data)[4],
    hardest = Object.values(req.body.data)[5],
    whatlearned = Object.values(req.body.data)[6],
    feedback = Object.values(req.body.data)[7],
    username = req.body.username,
    channel = req.body.channel_name;
    created_at = req.body.date;

  conn.query(`INSERT INTO checkout (rating, feeling, finished, energy, favorite, hardest, whatlearned, feedback, username, channel, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [rating, feeling, finished, energy, favorite, hardest, whatlearned, feedback, username, channel, created_at], (err, result) => {
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
});

app.post('/startcheckout', jsonParser, (req, res) => {
  console.log('THIS IS THE PLACE')
  console.log(req)
  const { user_name, channel_name } = req.body;
  console.log( user_name, channel_name);
  res.status(200).send({
    // "channel_id": "hawos4dqtby53pd64o4a4cmeoo",
    "channel_name": channel_name,
    // "team_domain": "someteam",
    // "team_id": "kwoknj9nwpypzgzy78wkw516qe",
    // "post_id": "axdygg1957njfe5pu38saikdho",
    "text": "",
    "timestamp": "1445532266",
    "token": "x8hw844oi7nqfns7ou1pjydbfy",
    "trigger_word": "checkout",
    "user_id": "rnina9994bde8mua79zqcg5hmo",
    "user_name": user_name,
    // "file_ids": "znana9194bde8mua70zqcg5hmo", 
    "attachments": [
      {
        "fallback": "checkout",
        "color": "#007930",
        // "pretext": "This is optional pretext that shows above the attachment.",
        "text": "Thank you for your feedback!",
        "author_name": "Green Fox Checkout",
        "author_icon": "https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/3317/s300/greenfoxacademylogo.jpg",
        "author_link": "https://www.greenfoxacademy.com/",
        "title": "Click here to fill out the daily checkout form",
        "title_link": `http://mmcheckoutfrontend.s3-website.eu-central-1.amazonaws.com?channel_name=${channel_name}&username=${user_name}`,
        // "actions": [
        //   {
        //     "type": "button",
        //     "text": "Feedback form",
        //     "url": "http://mmcheckoutfrontend.s3-website.eu-central-1.amazonaws.com/"
        //   }
        // ]
      }
    ]
  })
});

// app.get('/link', (req, res) => {
//   const { user_name, channel_name } = req.query;
//   res.status(200).redirect(`http://mmcheckoutfrontend.s3-website.eu-central-1.amazonaws.com?channel_name=${channel_name}&username=${user_name}`)
// });


app.get('/daily-feedback', (req, res) => {
  conn.query(`SELECT DISTINCT channel FROM checkout ORDER BY channel ASC`, (err, result) => {
    if (err) {
      console.log(`Database error daily-feedback`);
      res.status(500).send(err.message);
      return;
    } else {
      res.status(200).json({
        result,
      })
    }
  })
});

app.get('/checkouts/:channel', (req, res) => {
  conn.query(`SELECT * FROM checkout WHERE channel='${req.params.channel}';`, function (err, results) {
    let filteredByDate = results.filter(feedback => {
      return feedback.created_at.includes(req.query.day);
    });

    let dates = results.map(feedback => feedback.created_at);
    let uniqueDates = dates.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

    let channel = req.params.channel

    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    } else if (req.query.day) { 
      res.render('channelinfo', {
        results: filteredByDate,
        days: uniqueDates,
        channel: channel,
      })
    } else if (!req.query.day) {
      res.render('channelinfo', {
        results,
        days: uniqueDates,
        channel: channel,
      });
    }    
  });
});

module.exports = app;
