import mongoose from 'mongoose';

const stockSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
