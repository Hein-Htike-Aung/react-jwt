import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const verifyUser = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) return next(createError(401, 'You are not authenticated'));

	const token = authHeader.split(' ')[1];

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return next(createError(403, 'Token is not valid'));

		// if token is verified, set user into request (that can be used in whole applications)
		req.user = user;

		next();
	});
};
