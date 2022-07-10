import express from 'express';
import { deleteUser } from '../controllers/user.controller.js';
import { verifyUser } from '../middlewares/verify-user.js';

const userRoute = express.Router();

userRoute.delete('/:userId', verifyUser, deleteUser);

export default userRoute;
