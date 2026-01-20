import express from "express";
import {
  uputZaStacionarnoLecenjeCreate,
  uputZaStacionarnoLecenjeRead,
  uputZaStacionarnoLecenjeUpdate,
  uputZaStacionarnoLecenjeDelete,
} from "../controllers/uputZaStacionarnoLecenjeController.js";

const router = express.Router();

router.route("/").post(uputZaStacionarnoLecenjeCreate);
router.route("/:id").get(uputZaStacionarnoLecenjeRead);
router.route("/:id").patch(uputZaStacionarnoLecenjeUpdate);
router.route("/:id").delete(uputZaStacionarnoLecenjeDelete);

export default router;
