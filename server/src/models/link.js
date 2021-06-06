const mongoose = require('mongoose');
const validator = require('validator');

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  }, 
  url: {
    type: String,
    trim: true,
  },
  visible: {
    type: Boolean,
    required: true
  }
});

module.exports = linkSchema;