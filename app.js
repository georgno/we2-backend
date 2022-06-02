const express = require("express");
const database = require('./database/db');
const https = require('https');
const fs = require('fs');
const cors = require('cors')


const key = fs.readFileSync('./certificates/key.pem');
const cert = fs.readFileSync('./certificates/cert.pem');

const router = require("./routes/index.js");
const userRouter = require("./endpoints/user/UserRoute.js");
const publicUserRoute = require("./endpoints/user/PublicUserRoute.js");
const authRoute = require("./endpoints/authentication/AuthenticationRoute.js");
const forumRoute = require("./endpoints/forum/ForumRoute.js");
const forumMessageRoute = require("./endpoints/forumMessage/ForumMessageRoute.js");

const app = express();
const port = 443;

const server = https.createServer({key: key,cert: cert}, app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Expose-Headers","Authorization");
  next();
});

app.use('*', cors({
  exposedHeaders: ['*'],
}));

database.initDB(function (err, db) {
  if (db) {
    console.log("database connected");
  } else {
    console.error("connection to database failed");
  }
});

app.use('/', router);
app.use('/publicUser', publicUserRoute);
app.use('/user', userRouter);
app.use('/authenticate', authRoute);
app.use('/forum', forumRoute);
app.use('/forumMessage', forumMessageRoute);

server.listen(port, () => console.log(`web2 app listening on port ${port}!`));