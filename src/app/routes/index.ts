import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { CourseRoutes } from "../modules/course/course.routes";
import { ModuleRoutes } from "../modules/module/module.routes";
import { LessonRoutes } from "../modules/lesson/lesson.routes";

const router = express.Router();

// Define module routes for the LMS API
const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/course",
    route: CourseRoutes,
  },
  {
    path: "/module",
    route: ModuleRoutes,
  },
  {
    path: "/lesson",
    route: LessonRoutes,
  },
];

// Dynamically register module routes
moduleRoutes.forEach((route) => {
  try {
    router.use(route.path, route.route);
  } catch (error) {
    console.error(`Failed to load route ${route.path}:`, error);
  }
});

export default router;
