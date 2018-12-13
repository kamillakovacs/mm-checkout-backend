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
  // console.log(req)
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

app.post('/link', jsonParser, (req, res) => {
  const { user_name, channel_name } = req.query;
  res.status(200).send({
    "channel_id": "hawos4dqtby53pd64o4a4cmeoo",
    "channel_name": channel_name,
    "team_domain": "someteam",
    "team_id": "kwoknj9nwpypzgzy78wkw516qe",
    "post_id": "axdygg1957njfe5pu38saikdho",
    "text": "",
    "timestamp": "1445532266",
    "token": "hensght1ijyjjxpk56qpg98iny",
    "trigger_word": "/checkout",
    "user_id": "rnina9994bde8mua79zqcg5hmo",
    "user_name": user_name,
    "file_ids": "znana9194bde8mua70zqcg5hmo", 
    "attachments": [
      {
        "fallback": "test",
        "color": "#FF8000",
        "pretext": "This is optional pretext that shows above the attachment.",
        "text": "This is the text of the attachment. It should appear just above an image of the Mattermost logo. The left border of the attachment should be colored orange, and below the image it should include additional fields that are formatted in columns. At the top of the attachment, there should be an author name followed by a bolded title. Both the author name and the title should be hyperlinks.",
        "author_name": "Mattermost",
        "author_icon": "http://www.mattermost.org/wp-content/uploads/2016/04/icon_WS.png",
        "author_link": "http://www.mattermost.org/",
        "title": "Example Attachment",
        "title_link": "http://docs.mattermost.com/developer/message-attachments.html",
        // "fields": [
        //   {
        //     "short":false,
        //     "title":"Long Field",
        //     "value":"Testing with a very long piece of text that will take up the whole width of the table. And then some more text to make it extra long."
        //   },
        //   {
        //     "short":true,
        //     "title":"Column One",
        //     "value":"Testing"
        //   },
        //   {
        //     "short":true,
        //     "title":"Column Two",
        //     "value":"Testing"
        //   },
        //   {
        //   "short":false,
        //   "title":"Another Field",
        //   "value":"Testing"
        //   }
        // ],
        "image_url": "http://www.mattermost.org/wp-content/uploads/2016/03/logoHorizontal_WS.png",
        "actions": [
          {
            "name": "Select an option...",
            "integration": {
              "url": "http://127.0.0.1:7357/action_options",
              "context": {
                "action": "do_something"
              }
            },
            "type": "select",
            "data_source": "users"
          }
        ]
      }
    ]
  })
  // `Feedback form:\nhttp://mmcheckoutfrontend.s3-website.eu-central-1.amazonaws.com?channel_name=${channel_name}&username=${user_name}`)
});

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
