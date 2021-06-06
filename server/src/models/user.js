const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tree = require('./tree');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9._]+$/i, 'Usernames may only contain letters, numbers, underscores, and periods']
  },
  email: {
    type: String, 
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Email is invalid');
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    trim: true,
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

// Links users to their tree with the _id of the user and the tree's owner
userSchema.virtual('tree', {
  ref: 'Tree',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.email;

  return userObject;
}

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) throw new Error('Incorrect login details. Please retry.');

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) throw new Error('Incorrect login details. Please retry.');

  return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);

  next();
});

// Delete user tree when user is removed
userSchema.pre('remove', async function(next) {
  const user = this;
  await Tree.deleteMany( { owner: user._id} );
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;