import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import { specijalistaReadAll } from "../controllers/specijalistaController.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(ulogeMiddleware(Uloge.DOKTOR), specijalistaReadAll);

export default router;
