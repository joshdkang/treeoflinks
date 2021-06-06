const mongoose = require('mongoose');
const Link = require('../models/link');

const treeSchema = new mongoose.Schema({
  links: [Link],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  } 
}, {
  timestamps: true
});

const Tree = mongoose.model('Tree', treeSchema)

module.exports = Tree;