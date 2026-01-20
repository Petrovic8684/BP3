import express from "express";
import {
  dijagnozaCreate,
  dijagnozaRead,
  dijagnozaUpdate,
  dijagnozaDelete,
  dijagnozaSearch,
} from "../controllers/dijagnozaController.js";

const router = express.Router();

router.route("/").post(dijagnozaCreate);
router.route("/:id").get(dijagnozaRead);
router.route("/:id").patch(dijagnozaUpdate);
router.route("/:id").delete(dijagnozaDelete);

router.route("/search").post(dijagnozaSearch);

export default router;
