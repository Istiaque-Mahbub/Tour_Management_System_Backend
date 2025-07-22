import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { isActive } from "../modules/user/user.interface";

export const checkAuth =  (...auths:string[]) =>async  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid request");
      }

      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

       const isExist = await User.findOne({email:verifiedToken.email})

   if(!isExist){
    throw new AppError(httpStatus.NON_AUTHORITATIVE_INFORMATION,"User doesn't exist")
   }

   if(isExist.isActive===isActive.BLOCKED || isExist.isActive===isActive.INACTIVE){
      throw new AppError(httpStatus.BAD_REQUEST,`User is ${isExist.isActive}`)
   }

   if(isExist.isDeleted){
      throw new AppError(httpStatus.BAD_REQUEST,"User deleted")
   }

      if (!auths.includes(verifiedToken.role)) 
        {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You are not allowed to access this route"
        );
      }

      req.user= verifiedToken

      next();
    } catch (error) {
      next(error);
    }
  }