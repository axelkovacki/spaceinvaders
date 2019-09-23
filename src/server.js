const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const routes = express.Router();

app.use(cors());
app.use(express.json());

routes.get('/', (req, res) => {
  return res.sendFile(path.join(`${__dirname}/views/index.html`));
});

app.use(routes);

app.use(express.static(`${__dirname}/assets`));

app.listen(process.env.PORT || 8080);