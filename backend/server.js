import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai', aiRoutes);

// Seed default demo user and initial transactions
const seedDemoData = async () => {
  try {
    const existing = await User.findOne({ email: 'demo@example.com' });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      const demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@example.com',
        password: hashedPassword,
        monthlyBudget: 50000,
      });

      await Transaction.insertMany([
        { user: demoUser._id, type: 'income', amount: 65000, category: 'Salary', date: new Date(), note: 'Monthly Salary', paymentMethod: 'Bank Transfer' },
        { user: demoUser._id, type: 'expense', amount: 15000, category: 'Rent', date: new Date(), note: 'Apartment Rent', paymentMethod: 'Bank Transfer' },
        { user: demoUser._id, type: 'expense', amount: 5500, category: 'Food', date: new Date(), note: 'Groceries & Dining', paymentMethod: 'Card' },
        { user: demoUser._id, type: 'expense', amount: 2200, category: 'Utilities', date: new Date(), note: 'Electricity & Internet', paymentMethod: 'UPI' },
        { user: demoUser._id, type: 'expense', amount: 3000, category: 'Entertainment', date: new Date(), note: 'Movies & Outing', paymentMethod: 'UPI' },
        { user: demoUser._id, type: 'income', amount: 8000, category: 'Freelance', date: new Date(), note: 'UI Design gig', paymentMethod: 'Bank Transfer' },
      ]);
      console.log('Seeded demo account (demo@example.com / password123) with initial transactions.');
    }
  } catch (err) {
    console.error('Error seeding demo data:', err.message);
  }
};

// Database Connection
let dbPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    const uri = process.env.MONGO_URI;

    if (uri) {
      try {
        console.log('Connecting to provided MONGO_URI...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB successfully.');
        await seedDemoData();
        return;
      } catch (err) {
        console.warn('Could not connect to MONGO_URI:', err.message);
      }
    }

    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.warn('MONGO_URI is not set. Please add MONGO_URI to your Vercel Project Environment Variables.');
      return;
    }

    try {
      console.log('Checking local MongoDB at mongodb://127.0.0.1:27017/finance_dashboard...');
      await mongoose.connect('mongodb://127.0.0.1:27017/finance_dashboard', { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to local MongoDB.');
      await seedDemoData();
      return;
    } catch (err) {
      console.log('Local MongoDB not found. Starting in-memory database fallback...');
    }

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`Connected to in-memory MongoDB (${memoryUri})`);
      console.log('Tip: You can add a MONGO_URI in backend/.env to connect to MongoDB Atlas.');
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB:', memErr.message);
    }

    if (mongoose.connection.readyState >= 1) {
      await seedDemoData();
    }
  })();

  return dbPromise;
};

// Ensure DB is connected for requests
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
  next();
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
  });
}

export default app;
