import express from "express";
import {
  uputZaAmbulantnoSpecijalistickiPregledCreate,
  uputZaAmbulantnoSpecijalistickiPregledRead,
  uputZaAmbulantnoSpecijalistickiPregledUpdate,
  uputZaAmbulantnoSpecijalistickiPregledDelete,
} from "../controllers/uputZaAmbulantnoSpecijalistickiPregledController.js";

const router = express.Router();

router.route("/").post(uputZaAmbulantnoSpecijalistickiPregledCreate);
router.route("/:id").get(uputZaAmbulantnoSpecijalistickiPregledRead);
router.route("/:id").patch(uputZaAmbulantnoSpecijalistickiPregledUpdate);
router.route("/:id").delete(uputZaAmbulantnoSpecijalistickiPregledDelete);

export default router;
