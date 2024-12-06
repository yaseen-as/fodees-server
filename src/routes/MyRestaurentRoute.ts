import express from "express"
import MyRestourentController from "../controllers/MyRestourentController";
import multer from 'multer'
import { jwtCheck, jwtParser } from "../midilware/auth";
import { validateMyRestaurantRequest } from "../midilware/validate";

const router=express.Router();

const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize:5 * 1024 *1024,
    },
});
router.get('/',jwtCheck,jwtParser,MyRestourentController.getMyRestourent)
router.post("/",upload.single("imageFile"),jwtCheck,jwtParser,validateMyRestaurantRequest,MyRestourentController.createMyRestourent);
router.put("/",upload.single("imageFile"),jwtCheck,jwtParser,validateMyRestaurantRequest,MyRestourentController.updateMyRestourent);

export default router;