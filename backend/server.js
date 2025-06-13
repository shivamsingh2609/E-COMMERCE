import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './route/userRoute.js'; // ✅ Correct import
import cookieParser from 'cookie-parser';
import cartRouter from './route/cartRoutes.js';
import orderRouter from './route/orderRoute.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'https://e-commerce-sigma-two-13.vercel.app', 
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // ✅ EXACT origin of your Vite frontend
  credentials: true                // ✅ Allow sending cookies
}));
app.use(cookieParser());
app.use(express.json());

// ✅ Use the correct router variable
app.use('/api/cart', cartRouter)
app.use('/api/users', authRouter);
app.use('/api/orders', orderRouter)

// Dummy product data
const products = [
  {
    _id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation.',
    image: 'https://images.unsplash.com/photo-1580894894513-b3c229e546c6?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '2',
    name: 'Running Shoes',
    price: 59.99,
    category: 'Sports',
    description: 'Comfortable and stylish running shoes for everyday use.',
    image: 'https://images.unsplash.com/photo-1600185364506-1fe174e40805?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '3',
    name: 'Smartwatch',
    price: 149.99,
    category: 'Electronics',
    description: 'Stay connected and track your fitness with this smartwatch.',
    image: 'https://images.unsplash.com/photo-1611078489935-cf907556e3d2?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '4',
    name: 'T-Shirt',
    price: 19.99,
    category: 'Clothing',
    description: 'Casual cotton t-shirt available in multiple colors.',
    image: 'https://images.unsplash.com/photo-1602810316893-cc5b8a7ad205?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '5',
    name: 'Coffee Mug',
    price: 12.99,
    category: 'Home',
    description: 'Ceramic coffee mug perfect for your morning brew.',
    image: 'https://images.unsplash.com/photo-1571687967746-d9cbf014e24e?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '6',
    name: 'Fiction Book',
    price: 14.99,
    category: 'Books',
    description: 'A gripping novel from a bestselling author.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '7',
    name: 'Yoga Mat',
    price: 24.99,
    category: 'Sports',
    description: 'Non-slip yoga mat ideal for all types of yoga and workouts.',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bcde8?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '8',
    name: 'Skincare Set',
    price: 39.99,
    category: 'Beauty',
    description: 'Complete skincare set for glowing, healthy skin.',
    image: 'https://images.unsplash.com/photo-1588776814546-ec7a1a78a63e?auto=format&fit=crop&w=600&q=80',
  },
];

// ✅ Example API route for products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));
