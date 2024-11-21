import expess from "express";
import { getAllStocks, createStocks } from "../controllers/stocksControlle.js";

const router = expess.Router();

router.route("/").get(getAllStocks).post(createStocks);

export default router;
