import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  uputZaStacionarnoLecenjeCreate,
  uputZaStacionarnoLecenjeReadAll,
  uputZaStacionarnoLecenjeRead,
  uputZaStacionarnoLecenjeUpdate,
  uputZaStacionarnoLecenjeDelete,
} from "../controllers/uputZaStacionarnoLecenjeController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(
    ulogeMiddleware(Uloge.SPECIJALISTA, Uloge.DOKTOR),
    uputZaStacionarnoLecenjeReadAll,
  )
  .post(ulogeMiddleware(Uloge.DOKTOR), uputZaStacionarnoLecenjeCreate);

router
  .route("/:id")
  .get(ulogeMiddleware(Uloge.DOKTOR), uputZaStacionarnoLecenjeRead)
  .patch(ulogeMiddleware(Uloge.DOKTOR), uputZaStacionarnoLecenjeUpdate)
  .delete(ulogeMiddleware(Uloge.DOKTOR), uputZaStacionarnoLecenjeDelete);

export default router;
