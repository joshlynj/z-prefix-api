// require("dotenv").config();
const dbConnection = require('./controllers/dbConnection');
// const{ getIdForUser } = require('./controllers/controllers');
const cors = require('cors');
//middleware
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());
const morgan = require('morgan');
// module.exports = app;

// getIdforUser: (param) =>{
//   return knex.select(id).from('users').where({username: param})
// }

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://z-prefix-client.herokuapp.com/');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

  //Hashing
const { hash, compare } = require("bcrypt");
const saltRounds = 12;
const { createUser, getPasswordHash, getIdForUser, getPostForUser } = require("./controllers");
app.use(morgan("tiny"));
 
//console.log('node environment per heroku', process.env.NODE_ENV)

// get all for any table g2g
app.get('/:table', function(req, res) {
    dbConnection
      .select('*')
      .from(req.params.table)
      .then(data => res.status(200).json(data))
      .catch(err =>
        res.status(404).json({
          message:
            'The data you are looking for could not be found. Please try again'
        })
      );
  });

  //get by id  g2g
app.get('/:table/:id', function(req, res) {
    dbConnection
      .select('*')
      .from(req.params.table)
      .where({id: req.params.id})
      .then(data => res.status(200).json(data))
      .catch(err =>
        res.status(404).json({
          message:
            'The data you are looking for could not be found. Please try again'
        })
      );
  });


  app.get('/posts/users/:user_id', function(req, res) {
    dbConnection
      // .select('*')
      // .from(posts)
      // .where({user_id: req.params.user_id})

      getPostForUser(req.params.user_id)
      .then(data => res.status(200).json(data))
      .catch(err =>
        res.status(404).json({
          message:
            'The data you are looking for could not be found. Please try again'
        })
      );
  });


  // app.get('/:table/:user_id', function(req, res) {
  //   dbConnection
  //     .select('*')
  //     .from(req.params.table)
  //     .where({user_id: req.params.user_id})
  //     .then(data => res.status(200).json(data))
  //     .catch(err =>
  //       res.status(404).json({
  //         message:
  //           'USERIDThe data you are looking for could not be found. Please try again'
  //       })
  //     );
  //     console.log(data);
  // });


  // delete by id 
app.delete('/:table/:id', function(req, res) {
    dbConnection
  (req.params.table).where({ id: req.params.id}).del()
      .then((data) => res.status(200).json(data))
      .catch((err) => {
        console.error(err);
        res.status(404).json({ message: "Something is wrong." })
    })
  });

  // patch services g2g
app.patch('/posts/:id', function(req, res) {
    const {service, cost} = req.body;
    dbConnection
  ('posts').where({ id: req.params.id}).update({service: service, cost: cost})
    .then((data) => res.status(200).json(data))
      .catch((err) => {
        console.error(err);
        res.status(404).json({ message: "Something is wrong." })
    })
  });
  
//   // post to posts
// app.post('/users', function(req, res) {
//     dbConnection
//   .insert({ first_name: req.body.service, cost: req.body.cost}).from('posts')
//       .then((data) => res.status(201).json(data))
//       .catch((err) => {
//         console.error(err);
//         res.status(404).json({ message: "Something is wrong." })
//     })
//   });

  // post to posts
//{user_id: 1, service_id: 1, completion_status: false, part: 'Carburetor', make: null, model: null, year: null},
app.post('/posts', function(req, res) {
    console.log('New post created');
    dbConnection
  .insert({ user_id: req.body.user_id, title: req.body.title, content: req.body.content}).from('posts')
      .then((data) => res.status(201).json(data))
      .catch((err) => {
        console.error(`error here:`, err);
        res.status(404).json({ message: "Something is wrong." })
    })
  });

//password hashing code below
app.post("/users", function(req, res) {
    let {username, password, first_name, last_name} = req.body;
    
    if(!username) res.status(401).send('username required for signup')
    if(!password) res.status(401).send('password required for signup')
    if(!first_name) res.status(401).send('first name required for signup')
    if(!last_name) res.status(401).send('last name required for signup')
   
      else {
        hash(password, saltRounds).then(hashedPassword=>{
        console.log(`users real password:`, password);
        console.log(`That password is now:`, hashedPassword)
          createUser(username, hashedPassword, first_name, last_name)
          .then(data=> res.status(201).json("USER CREATED SUCCESFULLY"))
          .catch(err => res.status(500).json(err));
          });
        }
    });
    




// //login as a user- validates users credentials
app.post("/users/login", (req,res)=> {
    //compare password to passwordHash
    let {username, password} = req.body;
    
    // if (!username) res.status(401).send("username required for login");
    // else if (!password) res.status(401).send("password required for login");
    if(!username) res.status(401).send('Username required for Login');
    else if (!password) res.status(401).send('Pasword required for Login');
    else {
      getPasswordHash(username)
        .then((hashedPassword) => {
        compare(password, hashedPassword)
          .then((isMatch) => {

            if (isMatch) {
              getIdForUser(username)
              .then(response => res.status(201).json(response))
              .catch(err => res.status(501).json(err))
              // console.log(err)
            }
            else
              res.status(401).json('Incorrect Username or password supplied');
          })
          .catch((err) => {
            res.status(502).json(err);
            // console.log(err)
          });
      })
      .catch((err) => {
        res.status(503).json(err);
        // console.log(err)
      });
    }
  });


      
  //     getPasswordHash(username)
  //       .then((hashedPassword) => {
  //         console.log(`user's entered password:`, password);
  //         console.log(`That user's hashed password:`, hashedPassword);
  
  //         compare(password, hashedPassword)
  //           .then((isMatch) => {
  //             // send whatever back as json object
  //             // if 202, useNavigate to whatever page you want
  //             if (isMatch){
  //               getIdForUser(username)
  //               .then(res => res.status(201).json(res))
  //               .catch(err => res.status(500).json(err))
  //               // res.status(202).json("passwords match")
  //             // THIS IS THE SUCCESSFUL LOGIN RESPONSE
       
  //                 //.then((res) => res.status(201).send("test"));
  //                 //.catch((err) => res.status(500).json(err));
  //             } else{
  //               res.status(401).json(err);
  //             }
  //           })
  //           .catch((err) => {
  //             res.status(500).json(err);
  //           });
  //       })
  //       .catch((err) => {
  //         res.status(500).json(err);
  //       });
    
  // });
  


  module.exports = app;