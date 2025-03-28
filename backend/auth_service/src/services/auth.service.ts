import { db } from "../db/drizzle.connection";
import { eq } from "drizzle-orm";
import { User } from "../entities/user.entity";
import { CreateUserDTO, UserResponse, LoginUserDTO } from "@app_types/user.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../logger";
import config from "../config";
import redis from "../redis/connection"

dotenv.config();

export const loginUser = async (
  userData: LoginUserDTO,
): Promise<{accessToken: string, refreshToken: string}> => {
  const users = await db
    .select()
    .from(User)
    .where(eq(User.username, userData.username));
  if (!users) {
    throw new Error("User not found");
  }
  const user = users[0];
  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return {
    accessToken: generateAccessToken(user.id, user.username),
    refreshToken: generateRefreshToken(user.id, user.username),
  };
};

export const generateAccessToken = (
  userId: string, username: string,
): string => {
  const accessToken = jwt.sign(
    { id: userId, username: username, type: "access" },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );  
  return accessToken
}

export const generateRefreshToken = (
  userId: string, username: string,
): string => {
  const refreshToken = jwt.sign(
    { id: userId, username: username, type: "refresh" },
    config.JWT_SECRET,
    { expiresIn: "30d" },
  );  
  return refreshToken
}

export const getNewAccessToken = async (refreshToken: string): Promise<string> => {
  let tokenIsInBlacklist = false;
  try {
    const cachedRefreshToken = await redis.get(refreshToken);
    tokenIsInBlacklist = true;
  } catch (error: any) {}
  if (tokenIsInBlacklist) {
    logger.error(`Token is in blacklist`);
    throw new Error("Token is in blacklist");
  }
  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    const { username, type } = decoded as { username: string, type: string };
    if (type !== "refresh") {
      throw new Error("Need refresh token");
    }
    const users = await db
      .select({ id: User.id, username: User.username })
      .from(User)
      .where(eq(User.username, username));
    if (!users) {
      throw new Error("User not found");
    }
    const user = users[0];
    const accessToken = generateAccessToken(user.id, user.username);
    return accessToken
  }
  catch (error: any) {
    logger.error(`Invalid token: ${error.message}`);
    throw new Error(`Invalid token: ${error.message}`);
  }
}

export const getCurrentUser = async (accessToken: string): Promise<UserResponse> => {
  try {
    const decoded = jwt.verify(accessToken, config.JWT_SECRET);
    const { username, type } = decoded as { username: string, type: string };
    if (type !== "access") {
      throw new Error("Need access token");
    }
    const users = await db
      .select({ id: User.id, username: User.username })
      .from(User)
      .where(eq(User.username, username));
    if (!users) {
      throw new Error("User not found");
    }
    const user = users[0];
    return user;
  } catch (error: any) {
    logger.error(`Invalid token: ${error.message}`);
    throw new Error(`Invalid token: ${error.message}`);
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
    const [insertedUser] = await db.insert(User).values(newUser).returning();
    logger.info(`User ${newUser.username} successfully registered`);
    const createdUser: UserResponse = {
      id: insertedUser.id,
      username: insertedUser.username,
    };
    return createdUser;
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const addTokenToBlacklist = async (refreshToken: string) => {
  const expriresIn = 30 * 24 * 60 * 60; // 30 days
  await redis.set(refreshToken, "1", 'EX', expriresIn);
}