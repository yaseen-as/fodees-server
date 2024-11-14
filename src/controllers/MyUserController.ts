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
const updateCurentUser =async (req:Request,res:Response):Promise<any>=>{
    try {
        const {adressLine,name,country,city}=req.body;
        const user =await User.findById(req.userId)
        if (!user){
            return res.status(404).json({message:"user not found"})
        }
        user.adressLine=adressLine;
        user.name=name;
        user.country=country;
        user.city=city
        await user.save()

    } catch (error) {
        return res.sendStatus(401)
    }

}

export default{
    createCurentUser,
    updateCurentUser,
}