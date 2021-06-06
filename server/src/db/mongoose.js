const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// /Users/Josh/mongodb/bin/mongod.exe --dbpath=/Users/Josh/mongodb-data
// mongodb://127.0.0.1:27017/tree-of-links-api

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, 
(err) => {
  if (err) return console.log(err);
  console.log('Connected to MongoDB');
});

