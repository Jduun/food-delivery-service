import { Router } from "express";
import {
  getCurrentUserController,
  loginUserController,
  registerUser,
} from "../controllers/auth.controllers";

const router: Router = Router();

router.get("/users/me", getCurrentUserController);
router.post("/login", loginUserController);
router.post("/register", registerUser);

export default router;
