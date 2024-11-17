import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import CORS middleware
import authRoutes from './routes/authRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import { initConfig } from './config';
import notificationRoutes from './routes/notificationRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for all origins
app.use(cors()); // This will allow all origins

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/notifications', notificationRoutes);

// Start server
const PORT = process.env.PORT || 5002;

(async () => {
  await initConfig();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
