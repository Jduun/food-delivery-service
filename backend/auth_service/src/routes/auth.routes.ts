import { Router } from "express";
import {
  getCurrentUserController,
  loginUserController,
  registerUser,
  getAccessToken,
  logoutUser,
} from "../controllers/auth.controllers";

const router: Router = Router();

router.get("/users/me", getCurrentUserController);
router.post("/login", loginUserController);
router.post("/register", registerUser);
router.post("/refresh", getAccessToken)
router.post("/logout", logoutUser)

export default router;
