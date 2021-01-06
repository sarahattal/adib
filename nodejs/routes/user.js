const Router = require('express-promise-router')
const router = new Router()
const pool = require('../db /dbconfig');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/add', async (request, response) => {
  const {
    name,
    email,
    password
  } = request.body
  if (!name || !email || !password) response.status(401).send('error missing input data')
  else {

    bcrypt.hash(password, 10, async (err, hash) => {

      if (err) response.send("hash error")
      await pool.query('INSERT INTO "User" (name,email,password) VALUES ($1,$2,$3)', [name, email, hash], (error, results) => {
        if (error) {
          response.status(4).json({
            "error": error.detail
          })
        }
        response.send("Successfully inserted")
      })

    })
  }
})
router.post('/login', async (request, response) => {
  const userReq = request.body
  let user

  findUser(userReq)
    .then(foundUser => {
      checkPassword(userReq.password, foundUser)
        .then((pay) => {
          // console.log(pay);
          return new Promise(resolve => {
            tok = jwt.sign({
              "id": `${pay.id}`,
              "name": `${pay.name}`,
              "name": `${pay.name}`,
              "role": pay.rpa ? 'admin' : 'client'
            }, config.TOKEN_SECRET, {
              expiresIn: 86400 * 365 // expires in 1year
            });
            //  console.log(tok);
            resolve(tok)
          })
        })
        .then((token) => {
          return response.status(200).send({
            token: token
          })
        })
        .catch((err) => {
          return response.status(401).send({
            error: 'user or password missmatch'
          })
        })
    })
    .catch((err) => response.status(401).send({
      error: 'user not found'
    }))
})


// router.post('/login', async (request, response) => {
//   const userReq = request.body
//   findUser(userReq)
//     .then(foundUser => {
//       user = foundUser
//       return checkPassword(userReq.password, foundUser)
//     })
//     .then((res) => createToken(userReq))
//     .then((token) => {
//       console.log(token)
//       return response.status(200).send(token)
//     })
//     .catch((err) => response.send(err))
// })

// //================================================================
// const createToken = (data) => {
//   return new Promise((resolve, reject) => {
//     var token = jwt.sign({ "id": data.name }, config.TOKEN_SECRET, {
//       expiresIn: 86400 * 365 // expires in 1year
// });
//    console.log(token)
//     err ? reject(err) : resolve(token)

//   })
// }

router.put('/update', async (request, response) => {
  const {
    name,
    password
  } = request.body
  await pool.query('UPDATE "User" SET name =$1, password= $2 WHERE name =$1', [name, password],
    (error, results) => {
      if (error) {
        response.send('error in updating');
      }

      response.status(200).send('Successfully Updated');
    }
  )
})



const findUser = (userReq) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT id,name,password,rpa FROM "User" WHERE email= $1', [userReq.email])
      .then((data) => {
        //  console.log(data.rows);
        if (data.rows.length > 0) {
          //console.log(data);
          resolve(data.rows[0]);
        } else {
          reject("not found");
        }
      })
      .catch((err) => console.log(err))
  })
}

const checkPassword = (reqPassword, foundUser) => {
  return new Promise((resolve, reject) =>
    bcrypt.compare(reqPassword, foundUser.password, (err, response) => {
      // console.log('ssd' + err);
      if (err) {
        reject(err)
      } else if (response) {
        //   console.log(foundUser)
        resolve(foundUser)

      } else {
        reject('Passwords do not match.')
      }
    })
  )
}







module.exports = router