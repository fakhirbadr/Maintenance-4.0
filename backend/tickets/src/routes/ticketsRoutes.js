import express from "express";

import {
  getalltickets,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.route("/").get(getalltickets).post(createTicket);
router.route("/:id").get(getTicket).patch(updateTicket).delete(deleteTicket);

export default router;
