import express from "express";
import {
  addChart,
  getChart,
  removeChart,
  updateChart,
} from "./chartController.js";
const router = express.Router();
router.get("/", getChart);
router.post("/", addChart);
router.put("/:id", updateChart);
router.delete("/:id", removeChart);
export default router;
