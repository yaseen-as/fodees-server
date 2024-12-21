import express,{ Request,Response } from "express";
import cors from "cors";
import "dotenv/config"
import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary"
import myUserRouter from "./routes/userroute"
import MyRestourentRoute from "./routes/MyRestaurentRoute";
import restourentRoute from "./routes/RestaurentRoute";
import orderRoute from "./routes/OrderRoute"

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
.then((res)=>{console.log("db connected ")
})

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})


const app = express()
app.use(cors())
app.use(express.json())

app.get("/health",async(req:Request,res:Response)=>{
    res.send({message:"health is ok!"})
})

app.use('/api/my/user' ,myUserRouter);
app.use('/api/my/restourent' ,MyRestourentRoute);
app.use('/api/restourent' ,restourentRoute);
app.use('/api/order' ,orderRoute);


app.listen(5000,()=>{
    console.log("server running");
    
})