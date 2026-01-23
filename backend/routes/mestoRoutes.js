import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import { mestoReadAll } from "../controllers/mestoController.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(ulogeMiddleware(Uloge.TEHNICAR), mestoReadAll);

export default router;
