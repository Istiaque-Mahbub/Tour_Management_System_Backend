import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


// const createUser = async(req:Request,res:Response,next:NextFunction) =>{
//     try {
        
//         const user = await UserServices.createUser(req.body)

       
//         res.status(httpStatus.CREATED).json({
//             message:"User crated successfully",
//             user:user
//         })

//     } catch (error: any) {
//         console.log(error)
//        next(error)
//     }
// }

const createUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
     const user = await UserServices.createUser(req.body)

       
        // res.status(httpStatus.CREATED).json({
        //     message:"User crated successfully",
        //     user:user
        // })

        sendResponse(res,{
            success:true,
            statusCode:httpStatus.CREATED,
            message:"User crated successfully",
            data:user,
        })
})

const getAllUsers = catchAsync(async(req:Request,res:Response,next:NextFunction) =>{
     const result = await UserServices.getAllUsers()
        //  res.status(httpStatus.OK).json({
        //     success:true,
        //     message:"All user retrieved successfully",
        //     data:users
        //  })

        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"All user retrieved successfully",
            data:result.data,
            meta:result.meta
        })
})


export const UserControllers = {
    createUser,getAllUsers
}