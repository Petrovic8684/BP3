import express from "express";
import { doktorMedicineReadAll } from "../controllers/doktorMedicineController.js";

const router = express.Router();

router.route("/").get(doktorMedicineReadAll);

export default router;
