const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Helper function — generates a JWT token that expires in 7 days
 * Uses the secret key stored in your .env file.
 */
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email is already registered' });
    
    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account is deactivated. Please contact the admin.' });
    }
      
    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });
    
    res.json({
      token: generateToken(user._id),
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        profilePic: user.profilePic 
      }
    });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 */
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update profile (Handles Base64 strings for profile pictures)
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, bio, profilePic } = req.body;

    // Update basic fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    
    // UPDATED: image is now a Base64 string sent in the JSON body
    // We no longer use req.file.filename
    if (profilePic) {
      user.profilePic = profilePic;
    }
    
    await user.save();
    const updated = await User.findById(user._id).select('-password');
    res.json(updated);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 */
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const match = await user.matchPassword(currentPassword);
    
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    
    user.password = newPassword; // pre-save hook will hash this
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

module.exports = router;