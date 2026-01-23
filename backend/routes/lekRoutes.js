import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  lekCreate,
  lekReadAll,
  lekRead,
  lekUpdate,
  lekDelete,
} from "../controllers/lekController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(
    ulogeMiddleware(Uloge.TEHNICAR, Uloge.DOKTOR, Uloge.SPECIJALISTA),
    lekReadAll,
  )
  .post(
    ulogeMiddleware(Uloge.TEHNICAR, Uloge.DOKTOR, Uloge.SPECIJALISTA),
    lekCreate,
  );

router
  .route("/:id")
  .get(
    ulogeMiddleware(Uloge.TEHNICAR, Uloge.DOKTOR, Uloge.SPECIJALISTA),
    lekRead,
  )
  .patch(
    ulogeMiddleware(Uloge.TEHNICAR, Uloge.DOKTOR, Uloge.SPECIJALISTA),
    lekUpdate,
  )
  .delete(
    ulogeMiddleware(Uloge.TEHNICAR, Uloge.DOKTOR, Uloge.SPECIJALISTA),
    lekDelete,
  );

export default router;
