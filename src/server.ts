import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("Connected to database");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(
 async ()=>{
  await startServer();
await seedSuperAdmin()
}
)()

process.on("unhandledRejection", (error) => {
  console.log("Unhandled reaction detected server is shuting down...",error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});


process.on("uncaughtException",(error)=>{
    console.log("Uncaught exception detected",error)

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
})


process.on("SIGTERM",()=>{
    console.log("Server is terminated")

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGINT",()=>{
    console.log("Server is terminated")

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})



// Promise.reject(new Error("I forgot to catch this promise"))

// throw new Error("I forgot to handle to this error")
