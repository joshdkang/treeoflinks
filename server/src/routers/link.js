const express = require('express');
const Tree = require('../models/tree');
const auth = require('../middleware/auth');
const router = new express.Router();

// Searches tree collection for user's tree by id and returns it.
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

// Create new link
router.post('/admin/link', auth, async (req, res) => {
  const id = req.user._id;
  
  try {
    const tree = await getTree(id);
    tree.links.unshift({ title: '', url: '', visible: true });
    await tree.save();
    res.status(201).send(tree.links[0]);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// Update single link
router.patch('/admin/link', auth, async (req, res) => {
  const update = Object.assign({}, req.body);

  try {
      const tree = await Tree.findOne({ owner: req.user._id});
      const index = await tree.links.findIndex(link => link._id.equals(update._id));
      tree.links[index].title = update.title;
      tree.links[index].url = update.url;
      await tree.save();
      res.send(tree.links[index]);
  } catch (e) {
      res.status(400).send(e);
  }
});

// Delete single link
router.delete('/admin/link', auth, async (req, res) => {
  try {
      const tree = await Tree.findOne({ owner: req.user._id});

      if(!tree) return res.status(404).send();

      const index = tree.links.findIndex(link => link._id.equals(req.body._id));
      tree.links.splice(index, 1);
      await tree.save();
      res.send(tree);
  } catch (e) {
      res.status(500).send(e);
  }
});

module.exports = router