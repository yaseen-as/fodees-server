import express from 'express';
import MyUserController from '../controllers/MyUserController';
import { jwtCheck } from '../midilware/auth';

const router=express.Router()

router.post('/',jwtCheck,MyUserController.createCurentUser);

export default router;
