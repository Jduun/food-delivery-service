import { Router } from "express";
import {
  getCurrentUserHandler,
  handleLoginUser,
  registerUser,
} from "../controllers/auth.controller";

const router: Router = Router();

router.get("/users/me", getCurrentUserHandler);
router.post("/login", handleLoginUser);
router.post("/register", registerUser);

export default router;
