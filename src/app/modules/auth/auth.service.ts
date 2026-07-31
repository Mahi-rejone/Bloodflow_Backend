import httpStatus from "http-status";
import bcrypt from "bcrypt";
import ms from "ms";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import AppError from "../../error/AppError.js";
import { TLogin } from "./auth.interface.js";
import { prisma } from "../../DB/prisma.js";
import { config } from "../../config/config.js";
import { createToken, verifyToken } from "../../utils//auth.utils..js";
import { userServices } from "../user/user.service.js";

const login = async (payload: TLogin) => {
  const user = await userServices.isUserExist(payload.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }
  if (user.status === "BLOCK") {
    throw new AppError(httpStatus.BAD_REQUEST, "This user is blocked!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }
  if (
    !(await userServices.isPasswordMatched(payload.password, user.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched!");
  }

  const jwtPayload: { id: string; role: UserRole; email: string } = {
    id: user.id,
    role: user.role,
    email: user.email,
  };
  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_expires as ms.StringValue,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.refresh_secret as string,
    config.refresh_expires as ms.StringValue,
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: false, // wire to real field once/if added to schema
  };
};

const RefreshToken = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken, config.refresh_secret as string);
  const { id, email, iat } = decoded;

  const user = await prisma.user.findUnique({ where: { id, email } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is Deleted!");
  }
  if (user.status !== "ACTIVE") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }
  // NOTE: passwordChangedAt not yet on your schema — add it if you want this check enforced

  const jwtPayload: { id: string; role: UserRole; email: string } = {
    id: user.id,
    role: user.role,
    email: user.email,
  };
  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_expires as ms.StringValue,
  );
  return { accessToken };
};

const ChangePassword = async (
  userData: JwtPayload,
  password: { currentPassword: string; newPassword: string },
) => {
  const user = await userServices.isUserExist(userData.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }
  if (
    !(await userServices.isPasswordMatched(
      password.currentPassword,
      user.password,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched!");
  }
  const newHashedPassword = await bcrypt.hash(
    password.newPassword,
    Number(config.salt_rounds),
  );
  const result = await prisma.user.update({
    where: { id: userData.id },
    data: { password: newHashedPassword },
  });
  return result.updatedAt;
};

export const authServices = { login, RefreshToken, ChangePassword };
