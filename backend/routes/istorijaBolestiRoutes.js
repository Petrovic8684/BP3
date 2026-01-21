import express from "express";
import {
  istorijaBolestiCreate,
  istorijaBolestiReadAll,
  istorijaBolestiRead,
  istorijaBolestiUpdate,
  istorijaBolestiDelete,
} from "../controllers/istorijaBolestiController.js";

const router = express.Router();

router.route("/").post(istorijaBolestiCreate);
router.route("/").get(istorijaBolestiReadAll);
router.route("/:id").get(istorijaBolestiRead);
router.route("/:id").patch(istorijaBolestiUpdate);
router.route("/:id").delete(istorijaBolestiDelete);

export default router;
