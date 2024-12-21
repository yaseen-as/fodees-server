import express from "express";
import { jwtCheck, jwtParser } from "../midilware/auth";
import orderController from "../controllers/OrderController";

const router = express.Router();


router.get("/",jwtCheck,jwtParser,orderController.getMyOrders)
router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtCheck,
  orderController.createCheackoutSession
);

router.post("/checkout/webhook",orderController.stripeWebHookHandler)

export default router;
