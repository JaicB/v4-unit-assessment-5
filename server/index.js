require('dotenv').config();
const express = require('express'),
      userCtrl = require('./controllers/user'),
      postCtrl = require('./controllers/posts')
const massive = require('massive')
const session = require('express-session');
const user = require('./controllers/user');
const bcrypt = require('bcryptjs')

const {SERVER_PORT, CONNECTION_STRING, SECRET_SESSION} = process.env

const app = express();

app.use(express.json());
app.use(
    session({
        resave: false, 
        saveUninitialized: true,
        secret: process.env.SECRET_SESSION,
        cookie: {maxAge: 60000},
    })
)

// const register = (req, res, next) => {
//     const { username } = req.body
//     if (username === user.username) {
//         req.session.user = user
//         next()
//     } else {
//         res.status(400).send('User already exists')
//     }
// }

// const login = (req, res, next) => {
//     const
// }

app.post('/api/auth/register', async (req, res) => {
    let {username, password } = req.body
    let db = req.app.get('db')
    let userFound = await db.check_user_exists ([username]);
    if (userFound[0]) {
        return res.status(200).send('User already exists')
    }
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let createdUser = await db.creat_user([username, hash])
    req.session.user = {id: createdUser[0].id, username: createdUser[0].username}
    res.status(200).send(req.session.user)
})

app.post('/auth/login', async (req, res) => {
    let { username, password } = req.body;
    let db = req.app.get('db')
    let userFound = await db.check_user_exists([username])
    if (!userFound[0]) {
      return res.status(200).send('Incorrect username. Please resubmit');
    }
    let result = bcrypt.compareSync(password, userFound[0].hash_value)
    if (result) {
      req.session.user = { id: userFound[0].id, username: userFound[0].username }
      res.status(200).send(req.session.user)
    } else {
      return res.status(401).send('Incorrect username or password')
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  });

  app.get('/api/auth/me', (req, res) => {
      if (req.session.user) {
          res.status(200).send(req.session.user)
      } else {
          res.status(404).send('Please log in')
      }
  });

//Auth Endpoints
app.post('/api/auth/register', userCtrl.register);
app.post('/api/auth/login', userCtrl.login);
app.get('/api/auth/me', userCtrl.getUser);
app.post('/api/auth/logout', userCtrl.logout);

//Post Endpoints
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost)

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
      rejectUnauthorized: false
    }
  }).then((dbInstance) => {
    app.set('db', dbInstance);
    app.listen(SERVER_PORT, () => console.log(`Peace in the Middle East on port ${SERVER_PORT}`))
  });