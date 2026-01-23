import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  nalogZaDavanjeInjekcijaCreate,
  nalogZaDavanjeInjekcijaReadAll,
  nalogZaDavanjeInjekcijaRead,
  nalogZaDavanjeInjekcijaUpdate,
  nalogZaDavanjeInjekcijaDelete,
} from "../controllers/nalogZaDavanjeInjekcijaController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(
    ulogeMiddleware(Uloge.TEHNICAR, Uloge.DOKTOR),
    nalogZaDavanjeInjekcijaReadAll,
  )
  .post(ulogeMiddleware(Uloge.DOKTOR), nalogZaDavanjeInjekcijaCreate);

router
  .route("/:id")
  .get(
    ulogeMiddleware(Uloge.TEHNICAR, Uloge.DOKTOR),
    nalogZaDavanjeInjekcijaRead,
  )
  .patch(
    ulogeMiddleware(Uloge.TEHNICAR, Uloge.DOKTOR),
    nalogZaDavanjeInjekcijaUpdate,
  )
  .delete(ulogeMiddleware(Uloge.DOKTOR), nalogZaDavanjeInjekcijaDelete);

export default router;
