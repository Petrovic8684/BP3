import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  izvestajLekaraSpecijalisteCreate,
  izvestajLekaraSpecijalisteReadAll,
  izvestajLekaraSpecijalisteRead,
  izvestajLekaraSpecijalisteUpdate,
  izvestajLekaraSpecijalisteDelete,
} from "../controllers/izvestajLekaraSpecijalisteController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(ulogeMiddleware(Uloge.SPECIJALISTA), izvestajLekaraSpecijalisteReadAll)
  .post(ulogeMiddleware(Uloge.SPECIJALISTA), izvestajLekaraSpecijalisteCreate);

router
  .route("/:id")
  .get(ulogeMiddleware(Uloge.SPECIJALISTA), izvestajLekaraSpecijalisteRead)
  .patch(ulogeMiddleware(Uloge.SPECIJALISTA), izvestajLekaraSpecijalisteUpdate)
  .delete(
    ulogeMiddleware(Uloge.SPECIJALISTA),
    izvestajLekaraSpecijalisteDelete,
  );

export default router;
