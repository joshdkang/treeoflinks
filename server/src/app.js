const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routers/user');
const treeRouter = require('./routers/tree');
const linkRouter = require('./routers/link');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true
  })
);
app.use(userRouter);
app.use(treeRouter);
app.use(linkRouter);

module.exports = app;