const botconfig = require('./botqueries')
const user = require('./user')
const card = require('./card')
const images=require('./images')
const rpa=require('./rpa')
const botcomponent=require('./botcomponent')
var jwt = require('jsonwebtoken');
var moment = require('moment');
const config = require('../config')



function VerifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      error: 'Token_Missing'
    });
  }
  var token = req.headers.authorization.split(' ')[1];
  console.log(token);
  var payload = null;
  try {

    payload = jwt.verify(token, config.TOKEN_SECRET);
  } catch (err) {
    console.log(err)
    return res.status(401).send({
      error: "Token_Invalid"
    });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({
      error: 'Token_Expired'
    });
  }
  req.id = payload.id;
  req.name=payload.name;
  req.role = payload.role ? payload.role : 'client';
  console.log(payload.role)
 // console.log(payload)
  //console.log(req.id)
  //console.log(req.name)
  next();

};

module.exports = app => {
  app.use('/bot', VerifyToken, botconfig)
  app.use('/user', user)
  app.use('/card',VerifyToken,card)
  app.use('/images',VerifyToken, images)
  app.use('/rpa',VerifyToken, rpa)
  app.use('/botcomponent',VerifyToken,botcomponent)
}

