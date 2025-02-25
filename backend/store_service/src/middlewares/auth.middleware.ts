import { Request, Response, NextFunction } from "express";
import axios from "axios";
import logger from "../logger";
import { UserResponse } from "../@app_types/user.dto";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const response = await axios.get<UserResponse>(
      `http://auth_service:7045/auth/users/me`,
      {
        headers: {
          Authorization: authHeader,
        },
      },
    );
    const user = response.data;
    (req as any).user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ message: `Not authenticated` });
  }
};
