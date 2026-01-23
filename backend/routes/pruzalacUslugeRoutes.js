import express from "express";
import { pruzalacUslugeLogin } from "../controllers/pruzalacUslugeController.js";

const router = express.Router();

router.route("/prijava").post(pruzalacUslugeLogin);

export default router;
