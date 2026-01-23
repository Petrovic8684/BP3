import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  dijagnozaCreate,
  dijagnozaReadAll,
  dijagnozaRead,
  dijagnozaUpdate,
  dijagnozaDelete,
  dijagnozaSearch,
} from "../controllers/dijagnozaController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/search")
  .post(ulogeMiddleware(Uloge.DOKTOR, Uloge.SPECIJALISTA), dijagnozaSearch);

router
  .route("/")
  .get(ulogeMiddleware(Uloge.DOKTOR, Uloge.SPECIJALISTA), dijagnozaReadAll)
  .post(ulogeMiddleware(Uloge.SPECIJALISTA), dijagnozaCreate);

router
  .route("/:id")
  .get(ulogeMiddleware(Uloge.DOKTOR, Uloge.SPECIJALISTA), dijagnozaRead)
  .patch(ulogeMiddleware(Uloge.SPECIJALISTA), dijagnozaUpdate)
  .delete(ulogeMiddleware(Uloge.SPECIJALISTA), dijagnozaDelete);

export default router;
