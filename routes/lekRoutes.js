import express from "express";
import {
  lekCreate,
  lekRead,
  lekUpdate,
  lekDelete,
} from "../controllers/lekController.js";

const router = express.Router();

router.route("/").post(lekCreate);
router.route("/:id").get(lekRead);
router.route("/:id").patch(lekUpdate);
router.route("/:id").delete(lekDelete);

export default router;
