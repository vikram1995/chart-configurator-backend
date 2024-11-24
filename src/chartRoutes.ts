import express from "express";
import { addChart, removeChart, updateChart } from "./chartController.js";

const router = express.Router();

router.post("/add", addChart);
router.put("/update/:id", updateChart);
router.delete("/remove/:id", removeChart);

export default router;
