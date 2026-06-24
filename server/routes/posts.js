// server/routes/posts.js

import express from 'express';
import Post from '../models/Post.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- PUBLIC ROUTES (Read Operations) ---

// @route   GET /api/posts
// @desc    Fetch all posts
router.get('/', async (req, res) => {
  try {
    // Populate the author field to include username, not just ID
    const posts = await Post.find({}).populate('author', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// @route   GET /api/posts/:id
// @desc    Fetch a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// --- PROTECTED ROUTES (Create, Update, Delete) ---

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', protect, async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const post = new Post({
      title,
      content,
      tags,
      author: req.user._id, // req.user is set by the 'protect' middleware
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(400).json({ message: 'Invalid post data' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update an existing post
router.put('/:id', protect, async (req, res) => {
  const { title, content, tags } = req.body;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (post) {
      // 1. Check if the logged-in user is the author of the post
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this post' });
      }

      // 2. Update fields
      post.title = title || post.title;
      post.content = content || post.content;
      post.tags = tags || post.tags;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during update' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      // 1. Check if the logged-in user is the author
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this post' });
      }

      await Post.deleteOne({ _id: req.params.id });
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

export default router;