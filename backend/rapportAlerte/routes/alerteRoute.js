import express from "express";
import {
  createAlert,
  getAlert,
  getAllAlert,
} from "../controllers/alerteController.js";

const router = express.Router();

router.route("/").get(getAllAlert).post(createAlert);
router.route("/:id").get(getAlert);

export default router;
