import express,{ Request,Response } from "express";
import cors from "cors";
import "dotenv/config"
import mongoose from "mongoose";
import myUserRouter from "./routes/userroute"

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
.then((res)=>{console.log("db connected ")
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/my/user' ,myUserRouter);

app.listen(5000,()=>{
    console.log("server running");
    
})