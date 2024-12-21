import express from "express";
import RestourentController from "../controllers/RestourentController";
import { param } from "express-validator";

const router = express.Router();

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("city parameter must a valid string"),
  RestourentController.searchRestourent
);
router.get(
  "/search/:restourant",
  param("restourant")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("restourent parameter must a valid string"),
  RestourentController.getRestourent
);

export default router;
