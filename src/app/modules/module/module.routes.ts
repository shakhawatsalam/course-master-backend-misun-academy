import express from "express";
import { ModuleController } from "./module.controller";
// import auth from "../../middlewares/auth";
// import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

// CREATE module
router.post("/", ModuleController.createModule);

// GET all modules
router.get("/", ModuleController.getAllModules);

// GET single module by ID
router.get("/:id", ModuleController.getModuleById);

// UPDATE module
router.patch("/:id", ModuleController.updateModule);

// DELETE module
router.delete("/:id", ModuleController.deleteModule);

export const ModuleRoutes = router;
