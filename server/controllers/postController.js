import * as postService from '../services/postService.js';

export const listPosts = async (req, res) => res.json(await postService.listPosts());

export const getPost = async (req, res) => res.json(await postService.getPost(req.params.id));

export const createPost = async (req, res) => {
  const post = await postService.createPost(req.body, req.user._id);
  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  res.json(await postService.updatePost(req.params.id, req.body, req.user._id));
};

export const deletePost = async (req, res) => {
  await postService.deletePost(req.params.id, req.user._id);
  res.json({ message: 'Post removed' });
};