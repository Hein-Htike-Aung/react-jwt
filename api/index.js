import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';

const app = express();
dotenv.config();


/* Middlewares */
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.use(errorHandler);

app.listen(8800, () => {
	console.log('Connected to backend');
});
