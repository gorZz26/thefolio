const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const router = express.Router();

// GET all posts
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

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name profilePic');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LIKE / UNLIKE Post
router.put('/:id/like', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
      post.likes.push(req.user._id); // Like
    } else {
      post.likes.splice(index, 1); // Unlike
    }

    await post.save();
    await post.populate('author', 'name profilePic');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE Post (Updated for Base64 - No Multer)
router.post('/', protect, memberOrAdmin, async (req, res) => {
  try {
    const { title, body, image } = req.body; // image is now the Base64 string
    const post = await Post.create({ 
      title, 
      body, 
      image, // Saving text directly to MongoDB
      author: req.user._id 
    });
    await post.populate('author', 'name profilePic');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE Post (Updated for Base64 - No Multer)
router.put('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Permission check
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, body, status, image } = req.body;
    
    post.title = title || post.title;
    post.body = body || post.body;
    post.status = status || post.status;
    
    // If a new Base64 string is sent, update it
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

// DELETE Post
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;