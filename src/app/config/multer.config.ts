import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { CloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
    cloudinary : CloudinaryUpload,
    params:{
        public_id: (req,file)=>{
          const fileName = file.originalname
          .toLowerCase()
          .replace(/\s+/g,"-")
          .replace(/\./g,"-")
          .replace(/[^a-zA-Z0-9\-\.]/g,"")

          const extension = file.originalname.split(".").pop()

          const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension

          return uniqueFileName
        }
    }
})

export const multerUpload = multer({
    storage:storage
})