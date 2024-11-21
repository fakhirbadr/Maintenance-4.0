import mongoose from "mongoose";

const stocksSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
});

const Stocks = mongoose.model("Stocks", stocksSchema);

export default Stocks;
