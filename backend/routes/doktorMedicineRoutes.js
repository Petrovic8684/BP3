import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import { doktorMedicineReadAll } from "../controllers/doktorMedicineController.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(ulogeMiddleware(Uloge.TEHNICAR), doktorMedicineReadAll);

export default router;
