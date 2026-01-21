import express from "express";
import { mestoReadAll } from "../controllers/mestoController.js";

const router = express.Router();

router.route("/").get(mestoReadAll);

export default router;
