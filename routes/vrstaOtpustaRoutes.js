import express from "express";
import {
  vrstaOtpustaReadAll,
  vrstaOtpustaUpdate,
} from "../controllers/vrstaOtpustaController.js";

const router = express.Router();

router.route("/").get(vrstaOtpustaReadAll);
router.route("/").put(vrstaOtpustaUpdate);

export default router;
