const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const User = require('../models/user');
const Tree = require('../models/tree');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    let errors = {};
    const { username, email, password, passwordVerify } = req.body;

    if ( !username || !email || !password || !passwordVerify) errors.form = "Please enter all required fields.";
    if (password.length < 8) errors.password = 'Please enter a password of at least 8 characters.';
    if (password !== passwordVerify) errors.passwordVerify = 'Please enter the same password twice.';
   
    const existingEmail = await User.findOne({ email: email });
    const existingUser = await User.findOne({ username: username });

    if (existingEmail) errors.email = 'An account with this email already exists.'
    if (existingUser || username === 'admin' || username === 'login' || username === 'register' || username === 'appearance') 
      errors.username = 'An account with this username already exists.'

    if (Object.keys(errors).length > 0) throw errors;

    const user = new User({ username, email, password });
    await user.save();

    // Create user tree
    const newTree = new Tree({
      owner: user._id
    });
    await newTree.save();

    // log the user in
    const token = await user.generateAuthToken();

    // HTTP-only cookie cannot be read by javascript
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(201).send({ user, token });
  } catch (errors) {
    res.status(400).send(errors);
  }
});

router.post('/login', async (req, res) => {
  try {
    if (!req.body.username || !req.body.password)
      return res
        .status(400)
        .json({ message: "Please enter all required fields."
    });

    const user = await User.findByCredentials(req.body.username, req.body.password);
    const token = await user.generateAuthToken();
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.cookie('auth_token', '', {
      httpOnly: true,
      expires: new Date(0)
    }).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
      
    res.cookie('auth_token', '', {
      httpOnly: true,
      expires: new Date(0)
    }).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/account', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if(!isValidOperation) return res.status(400).send({ error: 'Invalid update!'});

  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/account', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = multer({
  limits: {
    fileSize: 2000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error('Please upload an image'));

    cb(undefined, true);    
  }
}); 

// Saves avatar to user data
router.post('/account/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 175, height: 175 }).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.status(200).send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

router.delete('/account/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get('/account/avatar/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if(!user) {
      res.status(201).send({ error: 'User not found.' });
      return;
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(undefined);
  }
});

router.get('/auth/loggedIn', async (req, res) => {
  try {
    const token = req.cookies['auth_token'];
    if (!token) return res.send({ username: undefined, loggedIn: false, avatar: undefined });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if(!user) return res.json({ username: undefined, loggedIn: false, avatar: undefined });
    
    res.send({ username: user.username, loggedIn: true, avatar: user.avatar });
  } catch (e) {
    res.json(false);
  }
})

module.exports = router;