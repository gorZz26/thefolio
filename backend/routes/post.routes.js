const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Adjust path if your model is elsewhere
const { protect } = require('../middleware/auth.middleware'); // Adjust path
const { memberOrAdmin } = require('../middleware/role.middleware'); // Adjust path

/**
 * @route   GET /api/posts
 * @desc    Get all posts
 */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   POST /api/posts
 * @desc    Create a post (Handles Base64 strings)
 */
router.post('/', protect, memberOrAdmin, async (req, res) => {
  try {
    const { title, body, image } = req.body; 

    // We don't use Multer here anymore. 
    // 'image' is just the long text string from req.body
    const newPost = new Post({
      title,
      body,
      image, // This is the Base64 string saved directly to MongoDB
      author: req.user._id,
      status: 'published'
    });

    const savedPost = await newPost.save();
    await savedPost.populate('author', 'name profilePic');
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post (Handles new Base64 strings)
 */
router.put('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, body, image } = req.body;
    
    post.title = title || post.title;
    post.body = body || post.body;
    
    // If a new Base64 image is sent, update it
    if (image) {
      post.image = image;
    }

    const updatedPost = await post.save();
    await updatedPost.populate('author', 'name profilePic');
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   DELETE /api/posts/:id
 */
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;