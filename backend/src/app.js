import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes); app.use('/api/courses', courseRoutes);
app.use((error, _req, res, _next) => { console.error(error); res.status(error.status || 500).json({ message: error.status ? error.message : 'Something went wrong. Please try again.' }); });
export default app;
