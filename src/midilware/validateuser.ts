import { body, validationResult } from "express-validator";
import { Request,Response,NextFunction } from "express";


const handleValidationError=async (req:Request,res:Response,next:NextFunction):Promise<any>=>{
    const error=validationResult(req)
    if(!error.isEmpty()){
        return res.sendStatus(400).json({error:error.array()});
    }
    next()
}
export const validateMyUserRequest=[
    body('name').isString().notEmpty().withMessage('enter valid name'),
    body('adressLine').isString().notEmpty().withMessage('enter valid adressLine'),
    body('city').isString().notEmpty().withMessage('enter valid city'),
    body('country').isString().notEmpty().withMessage('enter valid country'),
    handleValidationError,
]