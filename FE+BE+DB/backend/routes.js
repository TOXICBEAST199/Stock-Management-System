import express from 'express';
import Stock from './models/stockModel.js';
const router = express.Router();

// Get all stocks
router.get('/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new stock
router.post('/stocks', async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    const newStock = new Stock({ name, price, quantity });
    await newStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update stock (buy/sell)
router.put('/stocks/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    stock.quantity = stock.quantity + quantity;
    await stock.save();
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete stock
router.delete('/stocks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    await stock.remove();
    res.json({ message: 'Stock deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
