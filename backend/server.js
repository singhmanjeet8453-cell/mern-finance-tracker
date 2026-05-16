import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai', aiRoutes);

// Connect DB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finance_dashboard')
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  })
  .catch(err => console.log(err));

export default app;
