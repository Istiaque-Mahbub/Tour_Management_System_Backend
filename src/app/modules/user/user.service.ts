import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, isActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async(payload : Partial<IUser>) => {
    const {email,password,...rest} =payload

    const isExist = await User.findOne({email})

    if(isExist){
        throw new AppError(httpStatus.BAD_GATEWAY,"User Already Exist")
    }

    const hashPassword =await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND))

    const isPasswordMatch = await bcryptjs.compare(password as string, hashPassword)

    const authProvider : IAuthProvider = { provider:"credentials" ,providerId:email as string }

     const user = await User.create({
            email:email,
            password:hashPassword,
            auths:[authProvider],
            ...rest
        })
         return user
}


const updateUser = async(userId :string, payload : Partial<IUser>,decodedToken:JwtPayload)=>{

    const userExists = await User.findById(userId)

    if(!userExists){
        throw new AppError(httpStatus.NOT_FOUND,"User not found")
    }

    // if(userExists.isDeleted  || userExists.isActive===isActive.BLOCKED){
    //     throw new AppError(httpStatus.FORBIDDEN,"This user can not be updated")
    // }

   if(payload.role){
    if(decodedToken.role === Role.GUIDE || decodedToken.role === Role.USER){
        throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
    }
    if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
        throw new AppError(httpStatus.FORBIDDEN,"You are not allowed to do this")
    }
}

    if(payload.isActive || payload.isDeleted || payload.isVerified){
          if(decodedToken.role === Role.GUIDE || decodedToken.role === Role.USER){
        throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
    }
    }

    if(payload.password){
        payload.password = await bcryptjs.hash(payload.password,Number(envVars.BCRYPT_SALT_ROUND))
    }

    


const newUpdatedUser = await User.findByIdAndUpdate(userId,payload,{new:true,runValidators:true})
return newUpdatedUser
}


const getAllUsers = async() =>{
    const user = await User.find({})
    
    const totalUsers = await User.countDocuments()

    return {
        data : user,
        meta:{
            total : totalUsers
    }
}
}


export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}
