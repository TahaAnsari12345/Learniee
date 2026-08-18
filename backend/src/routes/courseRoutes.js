import { Router } from "express";
import { getCourse, listCourses } from "../controllers/courseController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = Router();
router.get("/", asyncHandler(listCourses));
router.get("/:id", asyncHandler(getCourse));
export default router;
