import {Request,Response} from 'express';
import User from '../models/user';

const createCurentUser=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {auth0Id}= req.body;
        const existUser = await User.findOne({auth0Id});
        if(existUser){
            return res.status(200).send();
        }
        const newUser= new User (req.body);
        await newUser.save()
        res.status(201).json(newUser.toObject())
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"error creating user"})
    }
}

export default{
    createCurentUser,
}