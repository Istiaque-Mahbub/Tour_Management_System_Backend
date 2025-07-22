import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service"
import { setAuthCookie } from "../../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"
import { createUserTokens } from "../../utils/userTokens"
import AppError from "../../errorHelpers/AppError"
import { envVars } from "../../config/env"



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
        message:"New access token retrieved successfully",
        data:tokenInfo
    })
})

const logout = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    res.clearCookie("accessToken",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })

    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })
    
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User logged out successfully",
        data:null
    })
})


const resetPassword = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    
    const decodedToken=req.user
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword
    
    await AuthServices.resetPassword(oldPassword,newPassword,decodedToken as JwtPayload)
    
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Password Changed Successfully",
        data:null
    })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : "" 

    if(redirectTo.startsWith("/")){
        redirectTo= redirectTo.slice(1)
    }

    // /booking => booking , => "/" => ""
    const user = req.user;


    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password Changed Successfully",
    //     data: null,
    // })

    res.redirect(`${envVars.FRONT_URL}/${redirectTo}`)
})


export const AuthControllers = {
    credentialLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}