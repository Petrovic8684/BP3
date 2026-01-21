import express from "express";
import {
  nalogZaDavanjeInjekcijaCreate,
  nalogZaDavanjeInjekcijaRead,
  nalogZaDavanjeInjekcijaUpdate,
  nalogZaDavanjeInjekcijaDelete,
} from "../controllers/nalogZaDavanjeInjekcijaController.js";

const router = express.Router();

router.route("/").post(nalogZaDavanjeInjekcijaCreate);
router.route("/:id").get(nalogZaDavanjeInjekcijaRead);
router.route("/:id").patch(nalogZaDavanjeInjekcijaUpdate);
router.route("/:id").delete(nalogZaDavanjeInjekcijaDelete);

export default router;
