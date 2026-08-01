import httpStatus from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError";
import { prisma } from "../../DB/prisma";
import { config } from "../../config/config";
import { BloodGroup, Prisma, UserRole } from "../../../generated/client";

const isUserExist = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const isPasswordMatched = async (plainText: string, hashedPass: string) => {
  return bcrypt.compare(plainText, hashedPass);
};
type TCreateUserPayload = {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  profile?: {
    bloodGroup: BloodGroup;
    phoneNumber: string;
    state: string;
    district: string;
    town: string;
    dateOfBirth: Date;
    gender: string;
  };
};

const createUserIntoDB = async (payload: TCreateUserPayload) => {
  if (await isUserExist(payload.email)) {
    throw new AppError(httpStatus.CONFLICT, "email already exists!");
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.salt_rounds),
  );
  const result = await prisma.$transaction(async (tx) => {
    const { profile, ...rest } = payload;
    rest.password = hashedPassword;
    profile!.dateOfBirth = new Date(profile!.dateOfBirth);
    const createProfile = await tx.userProfile.create({ data: profile! });
    if (!createProfile) {
      throw new AppError(httpStatus.FORBIDDEN, "failed to create user!");
    }
    const user = await tx.user.create({
      data: { profileId: createProfile.id, ...rest },
      omit: { password: true },
    });
    if (!user) {
      throw new AppError(httpStatus.FORBIDDEN, "failed to create user!");
    }

    return user;
  });
  return result;
};

const getMe = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
    include: { profile: true },
  });

  return result;
};
export const userServices = {
  isUserExist,
  isPasswordMatched,
  createUserIntoDB,
  getMe,
};
