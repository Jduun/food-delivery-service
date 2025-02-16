import { Router, Request, Response } from "express";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  res.json({ message: "Login" });
});

router.post("/register", (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: "Register" });
});

export default router;
