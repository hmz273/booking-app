import express from 'express';
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
  logout,
  activeAccount,
  addRole,
  getUsersByRole,
  getCurrentUser,
} from '@controllers/auth.controller';
import isAuth from '@middlewares/auth.middleware';
import { isAdmin } from '@middlewares/roles.middleware';

const authRouter = express.Router();

authRouter.get('/logout', isAuth, logout);
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.patch('/forgot', forgotPassword);
authRouter.patch('/reset/:token', resetPassword);
authRouter.patch('/active', activeAccount);
authRouter.patch('/role', addRole);
authRouter.get('/user', isAuth, getCurrentUser);
authRouter.get('/role', [isAuth, isAdmin], getUsersByRole);

export default authRouter;
