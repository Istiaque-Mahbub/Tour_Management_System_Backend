import mongoose from "mongoose"
import { IGenericErrorResponse, TErrorSources } from "../interfaces/error.types"

export const handleValidationError = (err:mongoose.Error.ValidationError):IGenericErrorResponse =>{
    const errorSources : TErrorSources[] = []

    
        const errors = Object.values(err.errors)
        errors.forEach((errorObject:any)=>errorSources.push({
            path:errorObject.path,
            message:errorObject.message
        }))
       

        return{
            statusCode:400,
            message:"Validation error",
            errorSources
        }
}