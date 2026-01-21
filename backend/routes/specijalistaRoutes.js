import express from "express";
import { specijalistaReadAll } from "../controllers/specijalistaController.js";

const router = express.Router();

router.route("/").get(specijalistaReadAll);

export default router;
