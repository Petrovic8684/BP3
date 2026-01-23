import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import { uzrokPovredeReadAll } from "../controllers/uzrokPovredeController.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(ulogeMiddleware(Uloge.SPECIJALISTA), uzrokPovredeReadAll);

export default router;
