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

export const validateMyRestaurantRequest=[
    body('restaurantName').notEmpty().withMessage('restureant name is required'),
    body('city').notEmpty().withMessage('city is requred'),
    body('country').notEmpty().withMessage('country is requred'),
    body('deliveryPrice').isFloat({min:0}).withMessage('deliver prise must positive number'),
    body('estimatedDeliveryTime').isInt({min:0}).withMessage('delivery time must be a a positive number'),
    body('cuisines').isArray().withMessage('cuisines must be an array').not().isEmpty().withMessage('cuisines must be array value'),
    body('menuItems').isArray().withMessage('menuItem must be an array'),
    body('menuItems.*.name').notEmpty().withMessage('menuitem neme  is required'),
    body('menuItems.*.price').isFloat({min:0}).withMessage('menuitem price must be a positive iint'),
    handleValidationError

]