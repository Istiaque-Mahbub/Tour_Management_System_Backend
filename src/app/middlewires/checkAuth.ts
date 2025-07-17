import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...auths:string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid request");
      }

      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

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