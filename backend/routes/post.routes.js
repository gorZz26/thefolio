const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');
const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).populate('author', 'name profilePic').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name profilePic');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// LIKE / UNLIKE Post (The New Part)
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
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CREATE Post
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const image = req.file ? req.file.filename : '';
    const post = await Post.create({ title, body, image, author: req.user._id });
    await post.populate('author', 'name profilePic');
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// EDIT and DELETE (Keep your existing code for these below)
// ... 

module.exports = router;