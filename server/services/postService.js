import Post from '../models/Post.js';
import { AppError } from '../utils/AppError.js';

const findPostOrFail = async (id) => {
  const post = await Post.findById(id);
  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
  return post;
};

const assertOwner = (post, userId) => {
  if (post.author.toString() !== userId.toString()) {
    throw new AppError('You do not own this post', 403, 'FORBIDDEN');
  }
};

export const listPosts = () => Post.find({ isPublished: true })
  .sort({ createdAt: -1 })
  .populate('author', 'username');

export const getPost = (id) => Post.findOne({ _id: id, isPublished: true })
  .populate('author', 'username')
  .then((post) => {
    if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
    return post;
  });

export const createPost = ({ title, content, tags }, userId) => Post.create({
  title,
  content,
  tags,
  author: userId,
});

export const updatePost = async (id, updates, userId) => {
  const post = await findPostOrFail(id);
  assertOwner(post, userId);
  Object.assign(post, updates);
  return post.save();
};

export const deletePost = async (id, userId) => {
  const post = await findPostOrFail(id);
  assertOwner(post, userId);
  await post.deleteOne();
};