const request = require('superagent');
const bodyParser = require('body-parser');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');
import restAdapters from './src/adapters/rest';

var app = express();
var compiler = webpack(config);
const jsonParser = bodyParser.json();

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('public'));

app.post('/message', jsonParser, (req, res) => {
  const { type, body } = req.body;
  console.log('sending with:');
  console.log(JSON.stringify(body));
  const restAdapter = restAdapters[body.exchange];
  restAdapter(type, body).then(response => {
    console.log(response.body);
    res.send(response.body);
  }, error => {
    console.error(error.response.body);
    res.status(400).send(error.response.body);
  });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080, '0.0.0.0', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:8080');
});
