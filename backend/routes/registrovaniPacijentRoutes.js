import express from "express";
import {
  registrovaniPacijentCreate,
  registrovaniPacijentReadAll,
  registrovaniPacijentRead,
  registrovaniPacijentUpdate,
  registrovaniPacijentDelete,
} from "../controllers/registrovaniPacijentController.js";

const router = express.Router();

router.route("/").post(registrovaniPacijentCreate);
router.route("/").get(registrovaniPacijentReadAll);
router.route("/:id").get(registrovaniPacijentRead);
router.route("/:id").patch(registrovaniPacijentUpdate);
router.route("/:id").delete(registrovaniPacijentDelete);

export default router;
