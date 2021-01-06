const Router = require('express-promise-router')
const router = new Router()
const express = require('express')

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
  uploadDir: './uploads'
});

var Joi = require('@hapi/joi');
const pool = require('../db /dbconfig');


router.post('/add_config', async (request, response) => {
  var u_name = request.name;
  u_id = request.id;
  console.log(u_name)
  console.log()
  const schema = Joi.object().keys({
    id: Joi.number(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    keywords: Joi.array().items(Joi.string().required()),

    card: Joi.number().required(),
    validation: Joi.array().items(Joi.string()).allow('', null),

  });

  var body = schema.validate(request.body);

  if (body.error) response.status(401).send({
    "error": body.error.details[0].message
  })
  else {
    const {
      name,
      type,
      keywords,
      card,
      validation
    } = request.body


    await pool.query('INSERT INTO chatbotconfig (name, keywords,card_id,validation,type,u_id) VALUES ($1, $2,$3,$4,$5,(SELECT id FROM "User" WHERE name =$6))', [name, keywords, card, validation, type, u_name], (error, results) => {

      if (error) {
        response.status(500).send({
          error: "error in adding"

        })
        console.log(error)
      } else {
        response.send({ok: "Successfully inserted"})
      }

    })
  }
})

router.get('/get_config_list', async (request, response) => {
  u_id = request.id;
  var u_name = request.name;
  await pool.query('SELECT conf.id, conf.name, conf.type, conf.keywords,conf.validation, c.cardname, c.card_id FROM chatbotconfig conf INNER JOIN "User" as u ON  conf.u_id = u.id INNER JOIN "card" as c ON conf.card_id = c.card_id where u.name=$1', [u_name], (error, results) => {
    if (error) {
      response.status(500).send("error")
    }
    response.status(200).json(results.rows)

  })

})

router.get('/getconfig_Byid/:id', async (request, response) => {

  var id = parseInt(request.params.id);
  await pool.query('SELECT * FROM chatbotconfig where id= $1', [id], (error, results) => {
    if (!results.rows[0] || (error)) {
      response.send('error');
      return;
    } else {
      response.status(200).json(results.rows)
      response.send('Successfully updated');
    }

  })

})

router.put('/update_config', async (request, response) => {
  var u_id = request.id;
  console.log(u_id)

  const schema = Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    keywords: Joi.array().items(Joi.string().required()),
    card: Joi.number().required(),
    validation: Joi.array().items(Joi.string()).allow('', null),
  });

  var body = schema.validate(request.body);
  //console.log(body.error);
  if (body.error) response.status(401).send({
    "error": body.error.details[0].message
  })
  else {
    const {
      id,
      name,
      type,
      keywords,
      card,
      validation
    } = request.body



    await pool.query('UPDATE chatbotconfig  SET name = $2, type = $3,keywords=$4, card_id=$5, validation=$6  WHERE id = $1 and u_id=$7 ',
      [id, name, type, keywords, card, validation, u_id],
      (error, results) => {
        console.log(results)
        if (error) {
          console.log(error)
          response.status(500).send('not_updated');
        } else response.status(200).json({status: 'Successfully Updated'});

      }
    )
  }
})


router.delete('/delete_config/:id', async (request, response) => {
  const id = parseInt(request.params.id)

  await pool.query('DELETE FROM chatbotconfig WHERE id = $1', [id], (error, results) => {

    if (error){
      response.status(500).send('server error ')
    }
    if (results.rowCount == 0 ){  response.status(500).send('id not exists')}
    else if(results.rowCount != 0){
    response.status(200).send({ok: 'Successfully deleted'})
    console.log(results);
    }


  })

})




module.exports = router