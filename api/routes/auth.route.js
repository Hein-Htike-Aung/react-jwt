import express from 'express';
import { login, logout, refresh } from '../controllers/auth.controller.js';
import { verifyUser } from '../middlewares/verify-user.js';

const authRoute = express.Router();

authRoute.post('/login', login);
authRoute.post('/refresh', refresh);
authRoute.post('/logout', verifyUser, logout);

export default authRoute;
