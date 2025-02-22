import { db } from "../db/drizzle.connection";
import { eq } from "drizzle-orm";
import { User } from "../entities/user.entity";
import { CreateUserDTO, UserResponse, LoginUserDTO } from "@app_types/user.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../logger";
import config from "../config";

dotenv.config();

export const loginUser = async (
  userData: LoginUserDTO,
): Promise<string | null> => {
  const users = await db
    .select()
    .from(User)
    .where(eq(User.username, userData.username));
  const user = users[0];
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    config.JWT_SECRET,
    { expiresIn: "1h" },
  );
  return token;
};

export const getCurrentUser = async (token: string): Promise<UserResponse> => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const { username } = decoded as { username: string };
    const users = await db
      .select({ id: User.id, username: User.username })
      .from(User)
      .where(eq(User.username, username));
    const user = users[0];
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error: any) {
    throw new Error("Invalid token: " + error.message);
  }
};

export const createUser = async (
  userData: CreateUserDTO,
): Promise<UserResponse> => {
  try {
    userData.password = await bcrypt.hash(userData.password, 10);
    const newUser: typeof User.$inferInsert = {
      username: userData.username,
      password: userData.password,
    };
    const [insertedUser] = await db
      .insert(User)
      .values(newUser)
      .returning({ id: User.id });
    logger.info(`User ${newUser.username} successfully registered`);
    const createdUser: UserResponse = {
      id: insertedUser.id,
      username: newUser.username,
    };
    return createdUser;
  } catch (error: any) {
    logger.error(error);
    throw new Error("Error creating user");
  }
};
