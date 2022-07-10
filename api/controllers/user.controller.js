import { createError } from '../utils/error.js';

export const deleteUser = (req, res, next) => {
	const userId = req.params.userId;
	const currentUser = req.user;

	if (currentUser.id !== userId && !currentUser.isAdmin)
		return next(createError(403, 'You are not allowed to deleted this user'));

	res.status(200).json({ message: 'User has been deleted' });
};
