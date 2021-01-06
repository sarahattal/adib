const Router = require('express-promise-router')
const router = new Router()
const express = require('express')


const pool = require('../db /dbconfig');


router.post('/add_botcomponenent', async (request, response) => {
    const {name,side_menu,color,icon}= request.body
    side_menu_str=JSON.stringify(side_menu)
    await pool.query('INSERT INTO botcomponent (name, side_menu, color, icon, timestamp) VALUES ($1,$2,$3,$4,NOW())', [name, side_menu_str,color,icon], (error, results) => {

        if (error) {
            response.status(500).send({
                err: 'Error'

            })
            console.log(error)
        } else {
            response.send({ ok: 'Successfully inserted' })
        }

    })

})

router.get('/get_botcomponents', async (request, response) => {

    await pool.query('SELECT name, side_menu , color,icon  FROM botcomponent',  (error, results) => {
      if (error) {
        response.status(500).send({err: 'Error'})
        console.log(error)
      }
      let data = [];
      results.rows.forEach((d) => {
        data.push({name: d.name,side_menu: d.side_menu});
      })
      console.log(results.rows)
      response.status(200).json(results.rows)
  
    })
  
  })



module.exports = router