import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Uloge, ulogeMiddleware } from "../middleware/ulogeMiddleware.js";
import {
  istorijaBolestiCreate,
  istorijaBolestiReadAll,
  istorijaBolestiRead,
  istorijaBolestiUpdate,
  istorijaBolestiDelete,
} from "../controllers/istorijaBolestiController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(ulogeMiddleware(Uloge.SPECIJALISTA), istorijaBolestiReadAll)
  .post(ulogeMiddleware(Uloge.SPECIJALISTA), istorijaBolestiCreate);

router
  .route("/:id")
  .get(ulogeMiddleware(Uloge.SPECIJALISTA), istorijaBolestiRead)
  .patch(ulogeMiddleware(Uloge.SPECIJALISTA), istorijaBolestiUpdate)
  .delete(ulogeMiddleware(Uloge.SPECIJALISTA), istorijaBolestiDelete);

export default router;
