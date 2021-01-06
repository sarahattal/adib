const Router = require('express-promise-router');
const router = new Router();
const pool = require('../db /dbconfig');
const fs = require('fs');
const sizeOf = require('image-size');
const path = require('path')
const multipart = require('connect-multiparty');
const upload = path.join(__dirname, '../uploads')
const multipartMiddleware = multipart({
  uploadDir: upload
});


router.post('/api/uploads', multipartMiddleware, async (req, res) => {
  console.log(req.files);
  // res.json({
  //     'message': 'File uploaded succesfully.',
  //     'path': req.files.file.path.split('/')[1]
  // });
  u_name = req.name;
  image_name = req.body.name;
  let url_name_arr = req.files.file.path.split('/');
  let url_name = url_name_arr[url_name_arr.length - 1]

  // const {Url} = require('postman-collection');

  // let url = new Url(pm.environment.get("url") + pm.request.url.getPath());

  // console.log(url.getPath())
  // console.log(path.join(__dirname,'../uploads'))
  var url = "http://it.ubilityai.systems:3000/img/" + url_name;
  if (req.files.file.size < 1048576) {
    if (req.files.file)
      await pool.query('INSERT INTO images (image_name,user_id,url) VALUES ($1,(SELECT id FROM "User" WHERE name =$2),$3)', [image_name, u_name, url], (error, results) => {

        if (error) {
          res.status(500).send({
            err: 'Error'

          })
          console.log(error)
        } else {
          res.send({ ok: "Successfully inserted" })
        }
      })
  } else {
    res.status(500).send({
      err: 'Size greater than 1MB'
    })
  }
})


router.get('/get_image_names', async (request, response) => {
  u_id = request.id;
  u_name = request.name;
  console.log(u_id)
  await pool.query('SELECT distinct i.image_name,i.url FROM images i INNER JOIN "User" as u ON  i.user_id = u.id where u.name= $1 ', [u_name], (error, results) => {
    if (error) {
      response.status(500).send({ err: 'Error' })
      console.log(error)
    }
    response.status(200).json(results.rows)

  })

})

router.delete('/delete_image/:name', async (request, response) => {
  u_id = request.id;
  i_name = request.params.name;
  await pool.query('DELETE FROM public.images WHERE user_id=$1 AND image_name=$2 RETURNING *', [u_id, i_name], (error, results) => {
    if (error) {
      console.log(error)
      response.status(500).send({ err: 'Error' })
    } else
      if (results.rowCount == 0) { response.status(500).send({ err: 'Image Does Not Exist!' }) }
      else {
        fs.unlink(`${upload}/${results.rows[0].url.split('/img/')[1]}`, (error) => {
          if (error)
            response.status(500).send({ err: 'Error' })
          else
            response.status(200).send({ ok: results });
        });
      }
  });
});

router.delete('/deleteFile/:name', async (request, response) => {
  u_id = request.id;
  i_name = request.params.name;

  fs.unlink(`${upload}/${i_name}`, (error) => {
    console.log('done')
    if (error)
      response.status(500).send({ err: 'Error' })
    else
      response.status(200).send({ ok: i_name });
  });

});

router.post('/api/uploadFile', multipartMiddleware, async (req, res) => {
  console.log(req.files);
  // res.json({
  //     'message': 'File uploaded succesfully.',
  //     'path': req.files.file.path.split('/')[1]
  // });
  u_name = req.name;
  image_name = req.body.name;
  let url_name_arr = req.files.file.path.split('/');
  let url_name = url_name_arr[url_name_arr.length - 1]

  // const {Url} = require('postman-collection');

  // let url = new Url(pm.environment.get("url") + pm.request.url.getPath());

  // console.log(url.getPath())

  var url = "http://it.ubilityai.systems:3000/img/" + url_name;

  res.status(200).json({ url: url });
})


module.exports = router