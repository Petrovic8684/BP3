import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  registrovaniPacijentCreate,
  registrovaniPacijentReadAll,
  registrovaniPacijentRead,
  registrovaniPacijentUpdate,
  registrovaniPacijentDelete,
} from "../controllers/registrovaniPacijentController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(
    ulogeMiddleware(Uloge.TEHNICAR, Uloge.DOKTOR, Uloge.SPECIJALISTA),
    registrovaniPacijentReadAll,
  )
  .post(ulogeMiddleware(Uloge.TEHNICAR), registrovaniPacijentCreate);

router
  .route("/:id")
  .get(ulogeMiddleware(Uloge.TEHNICAR), registrovaniPacijentRead)
  .patch(ulogeMiddleware(Uloge.TEHNICAR), registrovaniPacijentUpdate)
  .delete(ulogeMiddleware(Uloge.TEHNICAR), registrovaniPacijentDelete);

export default router;
