import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  vrstaOtpustaReadAll,
  vrstaOtpustaUpdate,
} from "../controllers/vrstaOtpustaController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(ulogeMiddleware(Uloge.SPECIJALISTA), vrstaOtpustaReadAll)
  .put(ulogeMiddleware(Uloge.SPECIJALISTA), vrstaOtpustaUpdate);

export default router;
