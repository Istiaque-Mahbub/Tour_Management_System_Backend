import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service"
import { setAuthCookie } from "../../utils/setCookie"



const credentialLogin = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const loginInfo = await AuthServices.credentialLogin(req.body)

    // res.cookie("accessToken",loginInfo.accessToken,{
    //     httpOnly:true,
    //     secure:false
    // })

    // setAuthCookie(res,loginInfo)

    setAuthCookie(res,loginInfo)
 
    // res.cookie("refreshToken",loginInfo.refreshToken,{
    //     httpOnly:true,
    //     secure:false
    // })

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User logged on successfully",
        data:loginInfo
    })
})

const getNewAccessToken = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const refreshToken = req.cookies.refreshToken

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    //  res.cookie("accessToken",tokenInfo.accessToken,{
    //     httpOnly:true,
    //     secure:false
    // })
      
//    setAuthCookie(res,tokenInfo)
      setAuthCookie(res,tokenInfo)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User logged on successfully",
        data:tokenInfo
    })
})

export const AuthControllers = {
    credentialLogin,
    getNewAccessToken
}