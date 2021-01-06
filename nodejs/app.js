var express = require("express");
var bodyParser = require('body-parser');
const pool = require('./db /dbconfig');
var jwt = require('jsonwebtoken');
var app = express();
var http = require('http');
var config = require('./config');
const mountRoutes = require('./routes');
var winston = require('./winston');
const Ansible = require('node-ansible');
var cors = require("cors");
var helmet = require("helmet");
var morgan = require('morgan');
var flag = false;
var path = require('path');
//const readLog = require('./readlog');

app.use(cors());
app.use(helmet());


app.use(bodyParser.urlencoded({
      extended: false
}));

//app.use(morgan("combined",{ "stream": winston.stream }));
app.use(bodyParser.json());
app.use('/img', express.static('uploads'))

app.get('/flag/true', function (req, res) {
      flag = true
      res.send({});
});
app.get('/flag/true', function (req, res) {
      flag = true
      res.send({});
});
app.get('/flag/false', function (req, res) {
      flag = false
      res.send({});
});

app.get('/flag', function (req, res) {

      res.send({ flag: flag });
});

app.post('/vpn', function (req, res) {
      const pass = req.body.pass;
      var playbook = new Ansible.Playbook().playbook(path.join(__dirname, 'openvpn')).variables({ pass: pass });
      var promise = playbook.exec();
      promise.then(function (successResult) {
            console.log(successResult.code); // Exit code of the executed command
            console.log(successResult.output) // Standard output/error of the executed command
            res.send("ok");
      }, function (error) {
            console.error(error);
            res.status(500).send("server error");
      });
});

app.use('/false', express.static('uploads'))
// app.set('view engine', 'ejs');

// app.get('/log', async (req, res) => {
//     try {
//         const entries = await readLog();
//         res.render('log', {entries: entries});
//     } catch(err) { res.sendStatus(500); }
// });


http.createServer(app).listen(config.LISTEN_PORT, () => {
      console.log('listening on port ' + config.LISTEN_PORT);
});


mountRoutes(app)