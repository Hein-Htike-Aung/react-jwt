import React, { useState } from 'react';
import './app.scss';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const App = () => {
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	const refreshToken = async () => {
		try {
			const res = await axios.post('/auth/refresh', {
				refreshToken: user.refreshToken,
			});

			setUser({
				...user,
				accessToken: res.data.accessToken,
				refreshToken: res.data.refreshToken,
			});

			return res.data;
		} catch (error) {}
	};

	// Create Axios Instance
	const axiosJWT = axios.create();

	// Axios Interceptor
	axiosJWT.interceptors.request.use(
		async (config) => {
			let currentDate = new Date();

			const decodedToken = jwt_decode(user.accessToken);

			if (decodedToken.exp * 1000 < currentDate.getTime()) {
				const tokens = await refreshToken();

				config.headers['authorization'] = 'Bearer ' + tokens.accessToken;
			}
			return config;
		},
		(error) => {
			// Cancel everything
			return Promise.reject(error);
		},
	);

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const res = await axios.post('/auth/login', {
				username,
				password,
			});

			setUser(res.data);
		} catch (error) {}
	};

	const handleDeleteUser = async (id) => {
		setSuccess(false);
		setError(false);

		try {
			await axiosJWT.delete(`/users/${id}`, {
				headers: {
					authorization: 'Bearer ' + user.accessToken,
				},
			});
			setSuccess(true);
		} catch (error) {
			setError(true);
		}
	};

	return (
		<div className='app'>
			<div className='loginContainer'>
				{user ? (
					<>
						<h3 className='title'>
							Welcome to the <b>{user.isAdmin ? 'admin' : 'user'}</b> dashboard{' '}
							{user?.username}
						</h3>
						<div className='content'>
							<span>DeleteUsers</span>
							<button onClick={() => handleDeleteUser(1)}>Delete John</button>
							<button onClick={() => handleDeleteUser(2)}>Delete Jane</button>
						</div>

						{error ? (
							<span className='message error'>
								You are not allowed to deleted this user
							</span>
						) : (
							<>
								{success ? (
									<span className='message'>
										User has been deleted successfully
									</span>
								) : (
									<span>&#8203;</span>
								)}
							</>
						)}
					</>
				) : (
					<>
						<h3 className='loginHeader'>Login</h3>
						<div className='loginContent'>
							<input
								type='text'
								className='loginInput'
								placeholder='username'
								onChange={(e) => setUsername(e.target.value)}
							/>
							<input
								type='password'
								className='loginInput'
								placeholder='password'
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button onClick={handleLogin} className='loginButton'>
								Login
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default App;
