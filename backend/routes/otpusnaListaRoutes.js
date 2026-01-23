import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  otpusnaListaCreate,
  otpusnaListaReadAll,
  otpusnaListaRead,
  otpusnaListaUpdate,
  otpusnaListaDelete,
} from "../controllers/otpusnaListaController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(ulogeMiddleware(Uloge.SPECIJALISTA), otpusnaListaReadAll)
  .post(ulogeMiddleware(Uloge.SPECIJALISTA), otpusnaListaCreate);

router
  .route("/:id")
  .get(ulogeMiddleware(Uloge.SPECIJALISTA), otpusnaListaRead)
  .patch(ulogeMiddleware(Uloge.SPECIJALISTA), otpusnaListaUpdate)
  .delete(ulogeMiddleware(Uloge.SPECIJALISTA), otpusnaListaDelete);

export default router;
