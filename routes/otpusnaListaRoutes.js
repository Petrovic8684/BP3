import express from "express";
import {
  otpusnaListaCreate,
  otpusnaListaRead,
  otpusnaListaUpdate,
  otpusnaListaDelete,
} from "../controllers/otpusnaListaController.js";

const router = express.Router();

router.route("/").post(otpusnaListaCreate);
router.route("/:id").get(otpusnaListaRead);
router.route("/:id").patch(otpusnaListaUpdate);
router.route("/:id").delete(otpusnaListaDelete);

export default router;
