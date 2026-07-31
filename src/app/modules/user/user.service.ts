import httpStatus from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError.js";
import { prisma } from "../../DB/prisma.js";
import { config } from "../../config/config";
import { Prisma } from "../../../generated/client";

const isUserExist = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const isPasswordMatched = async (plainText: string, hashedPass: string) => {
  return bcrypt.compare(plainText, hashedPass);
};

const createUserIntoDB = async (payload: Prisma.UserCreateInput) => {
  if (await isUserExist(payload.email)) {
    throw new AppError(httpStatus.CONFLICT, "Username already exists!");
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.salt_rounds),
  );
  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });
  const { password, ...rest } = result;
  return rest;
};

export const userServices = {
  isUserExist,
  isPasswordMatched,
  createUserIntoDB,
};
