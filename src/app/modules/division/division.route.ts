import { Router } from "express";

import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewires/checkAuth";
import { validateRequest } from "../../middlewires/validateRequest";
import { DivisionController } from "./divison.controller";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";



const router = Router()

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
);
router.get("/", DivisionController.getAllDivisions);
router.get("/:slug", DivisionController.getSingleDivision)
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateDivisionSchema),
    DivisionController.updateDivision
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision);

export const DivisionRoutes = router