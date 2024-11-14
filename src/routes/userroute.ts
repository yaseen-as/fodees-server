import express from 'express';
import MyUserController from '../controllers/MyUserController';
import { jwtCheck, jwtParser } from '../midilware/auth';
import {validateMyUserRequest} from '../midilware/validateuser';

const router=express.Router()

router.post('/',jwtCheck,MyUserController.createCurentUser);
router.put('/',jwtCheck,jwtParser,validateMyUserRequest,MyUserController.updateCurentUser);
export default router;
