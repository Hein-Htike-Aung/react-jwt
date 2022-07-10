import jwt from 'jsonwebtoken';
import { users } from '../dummy.js';
import { createError } from '../utils/error.js';

let refreshTokens = [];

export const login = (req, res, next) => {
	const { username, password } = req.body;

	// Check Credentials
	const user = users.find(
		(u) => u.username === username && u.password,
		password,
	);

	if (user) {
		// Generate Access token
		const accessToken = jwt.sign(
			{ id: user.id, isAdmin: user.isAdmin },
			process.env.JWT_SECRET,
			{ expiresIn: '5s' },
		);
		// Generate Refresh token
		const refreshToken = jwt.sign(
			{ id: user.id, isAdmin: user.isAdmin },
			process.env.JWT_REFRESH_SECRET,
		);

		// Save refresh token
		refreshTokens.push(refreshToken);

		res.json({
			username: user.username,
			isAdmin: user.isAdmin,
			accessToken,
			refreshToken,
		});
	} else {
		return next(createError(403, 'Wrong Credentials'));
	}
};

export const refresh = (req, res) => {
	const refreshToken = req.body.refreshToken;

	if (!refreshToken) return res.status(401).json('You are not authenticated');

	// verify refresh token
	if (!refreshTokens.includes(refreshToken))
		return res.status(403).json('Refresh token is not valid');

	jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
		if (err) return res.status(403).json('Refresh token is not valid');

		// rebase tokens
		refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

		const newAccessToken = jwt.sign(
			{ id: user.id, isAdmin: user.isAdmin },
			process.env.JWT_SECRET,
			{ expiresIn: '15m' },
		);

		const newRefreshToken = jwt.sign(
			{ id: user.id, isAdmin: user.isAdmin },
			process.env.JWT_REFRESH_SECRET,
		);

		refreshTokens.push(newRefreshToken);

		res.status(200).json({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	});
};

export const logout = (req, res) => {
	const refreshToken = req.body.refreshToken;

	refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

	req.user = null;

	res.status(200).json({ message: 'Logged out successfully' });
};
