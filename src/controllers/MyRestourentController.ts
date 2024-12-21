import { Request, Response } from "express";
import Restaurant from "../models/restourent";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

const getMyRestourent = async (req: Request, res: Response): Promise<any> => {
  try {
    const restourent = await Restaurant.findOne({ user: req.userId });
    if (!restourent) {
      return res.status(404).json({ msg: "restourent not found" });
    }
    res.status(200).json(restourent);
  } catch (error) {
    console.log("error,", error);
    res.status(500).json({ msg: "SWR" });
  }
};

const createMyRestourent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const existingRestourant = await Restaurant.findOne({ user: req.userId });
    if (existingRestourant) {
      return res.status(409).json({ message: "restourent alredy exist" });
    }
    const imageUrl = await uploadImage(req.file as Express.Multer.File);
    const restourent = new Restaurant(req.body);
    restourent.imageUrl = imageUrl;
    restourent.user = new mongoose.Types.ObjectId(req.userId);
    restourent.lastUpdated = new Date();
    await restourent.save();
    res.status(201).send(restourent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
const updateMyRestourent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const restourant = await Restaurant.findOne({ user: req.userId });
    if (!restourant) {
      return res.status(404).json({ message: "restourent not exist" });
    }
    restourant.restaurantName = req.body.restaurantName;
    restourant.city = req.body.city;
    restourant.country = req.body.country;
    restourant.deliveryPrice = req.body.deliveryPrice;
    restourant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restourant.cuisines = req.body.cuisines;
    restourant.menuItems = req.body.menuItems;
    restourant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restourant.imageUrl = imageUrl;
    }
    await restourant.save();
    res.status(200).send(restourant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const getMyRestaurantOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ msg: "restourent not found" });
    }
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("Restaurant")
      .populate("user");

    res.json(orders);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: "SWR" });
  }
};


const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {orderId}=req.params;
    const {status}=req.body;
    const order= await Order.findById(orderId);
    if(!order){
      return res.status(404).json({msg:"order not found"})
    }
    const restaurant=await Restaurant.findById(order.restaurant);
    if(restaurant?.user?._id.toString()!== req.userId){
      return res.status(401).send()
    }
    order.status=status;
    await order.save();
    res.status(200).json(order)

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to update status" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploaderResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploaderResponse.url;
};

export default {
  createMyRestourent,
  getMyRestourent,
  updateMyRestourent,
  getMyRestaurantOrders,
  updateOrderStatus
};
