import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const toPublicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
});

const generateToken = (id) => jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '30d' });

export const signup = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new AppError('Username or email is already registered', 409, 'USER_EXISTS');
  }

  const user = await User.create({ username, email, password });
  return { ...toPublicUser(user), token: generateToken(user._id) };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  return { ...toPublicUser(user), token: generateToken(user._id) };
};