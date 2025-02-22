import { Request, Response } from "express";
import {
  getCurrentUser,
  createUser,
  loginUser,
} from "../services/auth.service";
import { CreateUserDTO, LoginUserDTO } from "@app_types/user.dto";

export const getCurrentUserHandler = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Missing or invalid token");
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = await getCurrentUser(token);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(401).send("Invalid token");
  }
};

export const handleLoginUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user: LoginUserDTO = req.body;
  try {
    const token = await loginUser(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).send("Incorrect username or password");
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const user: CreateUserDTO = req.body;
  const minPasswordLength = 8;
  const maxPasswordLength = 100;
  const minUsernameLength = 1;
  const maxUsernameLength = 40;
  if (
    user.password.length < minPasswordLength ||
    user.password.length > maxPasswordLength
  ) {
    res
      .status(400)
      .send(
        `Password length must be no less than ${minPasswordLength} and no more than ${maxPasswordLength} characters long`,
      );
  }
  if (
    user.username.length < minUsernameLength ||
    user.username.length > maxUsernameLength
  ) {
    res
      .status(400)
      .send(
        `Username length must be no less than ${minUsernameLength} and no more than ${maxUsernameLength} characters long`,
      );
  } else {
    try {
      const newUser = await createUser(user);
      res.status(200).json(newUser);
    } catch (error) {
      res.status(409).send("User with the same name already exist");
    }
  }
};
