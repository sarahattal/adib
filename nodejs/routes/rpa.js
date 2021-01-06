const Router = require('express-promise-router')
const router = new Router()
const pool = require('../db /dbconfig');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const config = require('../config');

router.get('/role', async (req, res) => {
    console.log(req.role)
    res.status(200).send({ role: req.role });
})

module.exports = router