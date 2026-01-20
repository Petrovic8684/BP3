import express from "express";
import {
  registrovaniPacijentCreate,
  registrovaniPacijentRead,
  registrovaniPacijentUpdate,
  registrovaniPacijentDelete,
} from "../controllers/registrovaniPacijentController.js";

const router = express.Router();

router.route("/").post(registrovaniPacijentCreate);
router.route("/:id").get(registrovaniPacijentRead);
router.route("/:id").patch(registrovaniPacijentUpdate);
router.route("/:id").delete(registrovaniPacijentDelete);

export default router;
