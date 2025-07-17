
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { compare } from './../../../node_modules/bcryptjs/index';

export const generateToken = (payload : JwtPayload,secret:string,expiredIn:string) =>{
    const token = jwt.sign(payload,secret,{
        expiresIn:expiredIn
    } as SignOptions)

    return token
}


export const verifyToken = (token : string,secret:string)=>{
    const verifyToken = jwt.verify(token,secret)

    return verifyToken
}