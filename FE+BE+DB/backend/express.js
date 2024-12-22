import express from 'express';
import dotenv from 'dotenv';
import connectdb from './database.js';
import stockRoutes from './routes/stockRoutes.js';
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes
app.use('/api', stockRoutes);

// Database connection
connectdb();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
