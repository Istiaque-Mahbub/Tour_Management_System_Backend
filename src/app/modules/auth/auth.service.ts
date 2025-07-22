import AppError from "../../errorHelpers/AppError"
import { isActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import jwt, { JwtPayload, verify } from "jsonwebtoken"
import { envVars } from "../../config/env"
import { generateToken, verifyToken } from "../../utils/jwt"
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens"

const credentialLogin = async(payload : Partial<IUser>) =>{
   const {email,password} = payload

   const isExist = await User.findOne({email})

   if(!isExist){
    throw new AppError(httpStatus.NON_AUTHORITATIVE_INFORMATION,"Email doesn't exist")
   }

   const isPasswordMatch = await bcryptjs.compare(password as string ,isExist.password as string)

   if(!isPasswordMatch){
    throw new AppError (httpStatus.BAD_REQUEST,"Incorrect password")
   }
   // const jwtPayload ={
   //  userID : isExist._id,
   //  email: isExist.email,
   //  role: isExist.role
   // }

//    const accessToken = jwt.sign(jwtPayload,"secret",{
//     expiresIn:"1d"
//    })
   // const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

   // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

   const userTokens = createUserTokens(isExist)

   const {password : pass,...rest} = isExist.toObject()

   return{
    accessToken:userTokens.accessToken,
    refreshToken:userTokens.refreshToken,
    user:rest
   }
}

const getNewAccessToken = async(refreshToken:string) =>{
   const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
   return{
    accessToken:newAccessToken,
   
   }
}

const resetPassword = async(oldPassword:string,newPassword:string,decodedToken:JwtPayload) =>{


   const user = await User.findById(decodedToken.userID)


   const isOldPasswordMatched = await bcryptjs.compare(oldPassword,user!.password as string)

   if(!isOldPasswordMatched){
      throw new AppError(httpStatus.BAD_REQUEST,"Old password doesn't matched");
      
   }

   user!.password = await bcryptjs.hash(newPassword,Number(envVars.BCRYPT_SALT_ROUND))

   user!.save()

   
}


export const AuthServices = {
    credentialLogin,
    getNewAccessToken,
    resetPassword
}