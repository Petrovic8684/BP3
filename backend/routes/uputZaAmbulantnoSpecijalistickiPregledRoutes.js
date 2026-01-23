import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  uputZaAmbulantnoSpecijalistickiPregledCreate,
  uputZaAmbulantnoSpecijalistickiPregledReadAll,
  uputZaAmbulantnoSpecijalistickiPregledRead,
  uputZaAmbulantnoSpecijalistickiPregledUpdate,
  uputZaAmbulantnoSpecijalistickiPregledDelete,
} from "../controllers/uputZaAmbulantnoSpecijalistickiPregledController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(
    ulogeMiddleware(Uloge.SPECIJALISTA, Uloge.DOKTOR),
    uputZaAmbulantnoSpecijalistickiPregledReadAll,
  )
  .post(
    ulogeMiddleware(Uloge.DOKTOR),
    uputZaAmbulantnoSpecijalistickiPregledCreate,
  );

router
  .route("/:id")
  .get(
    ulogeMiddleware(Uloge.DOKTOR),
    uputZaAmbulantnoSpecijalistickiPregledRead,
  )
  .patch(
    ulogeMiddleware(Uloge.DOKTOR),
    uputZaAmbulantnoSpecijalistickiPregledUpdate,
  )
  .delete(
    ulogeMiddleware(Uloge.DOKTOR),
    uputZaAmbulantnoSpecijalistickiPregledDelete,
  );

export default router;
