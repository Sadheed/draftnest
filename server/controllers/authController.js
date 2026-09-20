import * as authService from '../services/authService.js';

export const signup = async (req, res) => {
  const user = await authService.signup(req.body);
  res.status(201).json(user);
};

export const login = async (req, res) => {
  const user = await authService.login(req.body);
  res.json(user);
};