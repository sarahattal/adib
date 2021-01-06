const Router = require('express-promise-router')
const router = new Router()
const express = require('express')

// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart({
//   uploadDir: './uploads'
// });

var Joi = require('@hapi/joi');
const pool = require('../db /dbconfig');


router.post('/add_card', async (request, response) => {
  
  u_id = request.id;
  u_name = request.name;

    const {name,card}= request.body
    await pool.query('INSERT INTO card (cardname,card,user_id,timestamp) VALUES ($1,$2,(SELECT id FROM "User" WHERE name =$3),NOW())', [name,card, u_name], (error, results) => {

      if (error) {
        response.status(500).send({
          err: 'Error'

        })
        console.log(error)
      } else {
        response.send({ok: 'Successfully inserted'})
      }

    })
  
})

router.get('/get_card_names', async (request, response) => {
    u_id = request.id;
    u_name = request.name;
  console.log(u_id)
    await pool.query('SELECT distinct c.cardname, c.card_id, c.timestamp FROM card c INNER JOIN "User" as u ON  c.user_id = u.id where u.name= $1 ORDER BY timestamp', [u_name], (error, results) => {
      if (error) {
        response.status(500).send({err: 'Error'})
        console.log(error)
      }
      let data = [];
      results.rows.forEach((d) => {
        data.push({name: d.cardname,id: d.card_id});
      })
      response.status(200).json(data)
  
    })
  
  })

  router.post('/get_card_by_name', async (request, response) => {
    u_id = request.id;
    u_name = request.name;
    c_name=request.body.name
  // console.log(u_id)
    await pool.query('SELECT  card FROM card c INNER JOIN "User" as u ON  c.user_id = u.id where u.name= $1 and c.cardname=$2 ', [u_name,c_name], (error, results) => {
      if (error) {
        response.status(500).send({err: 'Error'})
        console.log(error)
      }
      response.status(200).json(results.rows)
  
    })
  
  })


  router.delete('/delete_card/:name', async (request, response) => {
    u_id = request.id;
    u_name = request.name;
    c_name=request.params.name
    console.log(request.params);
    await pool.query('DELETE FROM card WHERE cardname = $1 and user_id = $2 ', [c_name,u_id], (error, results) => {
  
      if (error){
        console.log(error)
        response.status(500).send({err: 'Error'})
      }else
      if (results.rowCount == 0 ){  response.status(500).send('id not exists')}
      else if(results.rowCount != 0){
      response.status(200).send({ok:'Successfully deleted'});
      console.log(results);
      }
  
  
    })
  
  });

  router.put('/update',async (request, response) => {
    u_id = request.id;
    c_name = request.body.name;
    c_content = request.body.card;
    await pool.query('UPDATE public.card SET timestamp = NOW(), card=$1::json WHERE cardname = $2 AND user_id = $3', [c_content, c_name, u_id], (error, results) =>{
      if (error){
        console.log(error)
        response.status(500).send({err: 'Error'})
      }else
      if (results.rowCount == 0 ){  response.status(500).send('Data does not exist')}
      else response.status(200).send({ok: 'Successfully updated'});
    });
  });

router.get('/get_cards', async (request, response) => {

    await pool.query('SELECT  cardname,card FROM card ', (error, results) => {
      if (error) {
        response.status(500).send({err: 'Error'})
        console.log(error)
      }
      let data = [];
      results.rows.forEach((d) => {
        data.push({cardname: d.cardname,cardDetails: d.card});
      })
      response.status(200).json(data)
  
    })
  
    })
  




module.exports = router