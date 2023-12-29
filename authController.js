// authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./userModel');
const config = require('./config');

// Register a new user
exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    const savedUser = await user.save();

    res.json({
      message: 'User registered successfully',
      userId: savedUser._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
      expiresIn: '1d',
    });

    res.json({
      message: 'Logged in successfully',
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Verify token and user role
exports.verifyTokenAndAdmin = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Requires admin role' });
    }

    req.userId = decoded.id;
    next();
  });
};
