import AppError from "../../errorHelpers/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { envVars } from "../../config/env"
import { generateToken } from "../../utils/jwt"

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
   const jwtPayload ={
    userID : isExist._id,
    email: isExist.email,
    role: isExist.role
   }

//    const accessToken = jwt.sign(jwtPayload,"secret",{
//     expiresIn:"1d"
//    })
   const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

   return{
    accessToken
   }
}

export const AuthServices = {
    credentialLogin
}