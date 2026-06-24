// server/models/Post.js

import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  // Reference to the User model (the author)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model
    required: true,
  },
  tags: [String], // Array of strings for categorization
  isPublished: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
export default Post;