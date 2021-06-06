const express = require('express');
const User = require('../models/user');
const Tree = require('../models/tree');
const Link = require('../models/link');
const auth = require('../middleware/auth');
const router = new express.Router();

// Searches tree collection for user's tree by user id and returns it.
// Creates an empty tree and returns it if no tree is found.
const getTree = async (id) => {
  const tree = await Tree.findOne({ owner: id });
  if (tree) return tree;

  const newTree = new Tree({
    owner: id
  });
  await newTree.save();
  return newTree;
};

// Searches for a tree by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if(!user) {
      res.status(201).send({ error: 'User not found.' });
      return;
    }

    const tree = await getTree(user._id);
    res.status(201).send(tree.links);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Returns the user tree
router.post('/admin', auth, async (req, res) => { 
  try {
    const tree = await getTree(req.user._id);
    res.status(201).send(tree.links);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update links array
router.patch('/admin', auth, async (req, res) => {
  const id = req.user._id;
  try {
    const tree = await getTree(id);
    tree.links = [];

    req.body.forEach((link) => {
      tree.links.push(link);
    });

    await tree.save();
    res.status(201).send(tree.links);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/admin', auth, async (req, res) => {
  try {
      const tree = await Tree.findOneAndDelete( { owner: req.user._id });
      if(!tree) return res.status(404).send();
      
      res.send(tree);
  } catch (e) {
      res.status(500).send(e);
  }
});

module.exports = router;