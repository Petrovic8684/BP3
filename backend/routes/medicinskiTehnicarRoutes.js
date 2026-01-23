import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import { medicinskiTehnicarReadAll } from "../controllers/medicinskiTehnicarController.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(ulogeMiddleware(Uloge.DOKTOR), medicinskiTehnicarReadAll);

export default router;
