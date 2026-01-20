import express from "express";
import {
  izvestajLekaraSpecijalisteCreate,
  izvestajLekaraSpecijalisteRead,
  izvestajLekaraSpecijalisteUpdate,
  izvestajLekaraSpecijalisteDelete,
} from "../controllers/izvestajLekaraSpecijalisteController.js";

const router = express.Router();

router.route("/").post(izvestajLekaraSpecijalisteCreate);
router.route("/:id").get(izvestajLekaraSpecijalisteRead);
router.route("/:id").patch(izvestajLekaraSpecijalisteUpdate);
router.route("/:id").delete(izvestajLekaraSpecijalisteDelete);

export default router;
