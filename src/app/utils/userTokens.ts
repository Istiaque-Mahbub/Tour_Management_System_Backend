import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { isActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import httpStatus  from 'http-status-codes';
import { User } from "../modules/user/user.model";

export const createUserTokens = (user: Partial<IUser>) =>{
      const jwtPayload ={
        userID : user._id,
        email: user.email,
        role: user.role
       }
    
    //    const accessToken = jwt.sign(jwtPayload,"secret",{
    //     expiresIn:"1d"
    //    })
       const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
    
       const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

       return{
         accessToken,
         refreshToken
       }
}


export const createNewAccessTokenWithRefreshToken = async(refreshToken:string)=>{
    const verifiedRefreshToken = verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload
   
   if(!verifiedRefreshToken){
      throw new AppError(httpStatus.BAD_GATEWAY,"No refresh token received")
   }

   const isExist = await User.findOne({email:verifiedRefreshToken.email})

   if(!isExist){
    throw new AppError(httpStatus.NON_AUTHORITATIVE_INFORMATION,"User doesn't exist")
   }

   if(isExist.isActive===isActive.BLOCKED || isExist.isActive===isActive.INACTIVE){
      throw new AppError(httpStatus.BAD_REQUEST,`User is ${isExist.isActive}`)
   }

   if(isExist.isDeleted){
      throw new AppError(httpStatus.BAD_REQUEST,"User deleted")
   }

   
   const jwtPayload ={
    userID : isExist._id,
    email: isExist.email,
    role: isExist.role
   }

   
   const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

   return accessToken

}