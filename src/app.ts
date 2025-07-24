import express, { Request, Response, NextFunction } from "express"
import { UserRoutes } from "./app/modules/user/user.route"
import cors from 'cors'
import { router } from "./app/routes"
import { envVars } from "./app/config/env"
import { globalErrorHandler } from "./app/middlewires/globalErrorHandler"
import  httpStatus  from 'http-status-codes';
import notFound from "./app/middlewires/notFound"
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"
import "./app/config/passport"

const app = express()

app.use(expressSession({
    secret:envVars.EXPRESS_SESSION,
    saveUninitialized:false,
    resave:false
}))

app.use(passport.initialize())

app.use(passport.session())

app.use(cookieParser())

app.use(express.json())

app.use('/api/v1',router)

app.use(cors())

app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({
        message:"Welcome to tour management backend"
    })
})


app.use(globalErrorHandler)

app.use(notFound)

export default app