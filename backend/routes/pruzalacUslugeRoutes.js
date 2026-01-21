import express from "express";
import {
  pruzalacUslugeLogin,
  pruzalacUslugeRead,
} from "../controllers/pruzalacUslugeController.js";

const router = express.Router();

router.route("/prijava").post(pruzalacUslugeLogin);
router.route("/:id").get(pruzalacUslugeRead);

export default router;
