// For API
const express = require('express');
const app = express();
const cors = require('cors');
const routes = express.Router();

// For Aux Functions
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());

routes.get('/', (req, res) => {
  return res.sendFile(path.join(`${__dirname}/views/index.html`));
});

routes.get('/scores', (req, res) => {
  let users = fs.readFileSync(`${__dirname}/assets/js/users.json`);
  users = JSON.parse(users);

  if(users.length === 0) {
    return res.status(404).send('Scores not found');
  }

  let scores = new Array();

  users.map((a) => {    
    let hasNew = true;

    scores.map((b, i) => {
      if(b.name === a.fn) {
        scores[i] = {
          name: a.fn,
          score: a.score
        }
        hasNew = false;
      }
    });

    if(hasNew) {
      scores.push({
        name: a.fn,
        score: a.score
      });
    }
  });

  return res.status(200).json(scores);
});

routes.post('/create-user', (req, res) => {
  let users = fs.readFileSync(`${__dirname}/assets/js/users.json`);
  users = JSON.parse(users);

  users.push(req.body);

  fs.writeFile(`${__dirname}/assets/js/users.json`, JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).send('Fail to save User');
    }
  });

  return res.status(200).json(req.body);
});

app.use(routes);

app.use(express.static(`${__dirname}/assets`));

app.listen(process.env.PORT || 8080);