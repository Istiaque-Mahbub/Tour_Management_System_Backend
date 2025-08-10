import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import z, { AnyZodObject, object } from "zod";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewires/validateRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewires/checkAuth";

const router = Router();



router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.patch("/:id",checkAuth(...Object.values(Role)),validateRequest(updateUserZodSchema),UserControllers.updateUser)

router.get(
  "/all-users",validateRequest(updateUserZodSchema),checkAuth(Role.ADMIN,Role.SUPER_ADMIN), UserControllers.getAllUsers
);

export const UserRoutes = router;
