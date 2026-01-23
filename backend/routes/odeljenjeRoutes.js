import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import { odeljenjeReadAll } from "../controllers/odeljenjeController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(ulogeMiddleware(Uloge.DOKTOR, Uloge.SPECIJALISTA), odeljenjeReadAll);

export default router;
