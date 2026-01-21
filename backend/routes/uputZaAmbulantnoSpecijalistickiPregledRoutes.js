import express from "express";
import {
  uputZaAmbulantnoSpecijalistickiPregledCreate,
  uputZaAmbulantnoSpecijalistickiPregledReadAll,
  uputZaAmbulantnoSpecijalistickiPregledRead,
  uputZaAmbulantnoSpecijalistickiPregledUpdate,
  uputZaAmbulantnoSpecijalistickiPregledDelete,
} from "../controllers/uputZaAmbulantnoSpecijalistickiPregledController.js";

const router = express.Router();

router.route("/").post(uputZaAmbulantnoSpecijalistickiPregledCreate);
router.route("/").get(uputZaAmbulantnoSpecijalistickiPregledReadAll);
router.route("/:id").get(uputZaAmbulantnoSpecijalistickiPregledRead);
router.route("/:id").patch(uputZaAmbulantnoSpecijalistickiPregledUpdate);
router.route("/:id").delete(uputZaAmbulantnoSpecijalistickiPregledDelete);

export default router;
