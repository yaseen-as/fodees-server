import { Response, Request } from "express";
import Stripe from "stripe";
import Restaurant, { menuItemType } from "../models/restourent";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;

type CheckOutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine: string;
    city: string;
  };
  restourantId: string;
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("Restaurant")
      .populate("user");
    res.json(orders);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: "SWR" });
  }
};

const stripeWebHookHandler = async (req: Request, res: Response) => {
  console.log("RESIVED EVENDS...");
  console.log("================");
  console.log("EVENDS:", req.body);
  res.send();
};
const createCheackoutSession = async (req: Request, res: Response) => {
  try {
    const checkOutSessionRequest: CheckOutSessionRequest = req.body;
    const restourant = await Restaurant.findById(
      checkOutSessionRequest.restourantId
    );
    if (!restourant) {
      throw new Error("Restourent not found");
    }
    const newOrder = new Order({
      restaurant: restourant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkOutSessionRequest.deliveryDetails,
      cartItems: checkOutSessionRequest.cartItems,
      createdAt: new Date(),
    });
    const lineItems = createLineItem(
      checkOutSessionRequest,
      restourant.menuItems
    );
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restourant.deliveryPrice,
      restourant._id.toString()
    );
    if (!session.url) {
      res.status(500).json({ msg: "SWR" });
    }
    await newOrder.save();
    res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: error.row.massage });
  }
};

const createLineItem = (
  checkOutSessionRequest: CheckOutSessionRequest,
  menuItems: menuItemType[]
) => {
  const lineItems = checkOutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find((item) => {
      item._id.toString() === cartItem.menuItemId.toString();
    });
    if (!menuItem) {
      throw new Error(`menuItem not found${cartItem.menuItemId}`);
    }
    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "gbp",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };
    return line_item;
  });
  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  ordreId: string,
  deliveryPrice: number,
  restourantId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "gbp",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      ordreId,
      restourantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restourantId}?cancelled=true`,
  });
  return sessionData;
};

export default { createCheackoutSession, stripeWebHookHandler,getMyOrders };
