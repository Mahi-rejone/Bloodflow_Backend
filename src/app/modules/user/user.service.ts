import httpStatus from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError";
import { prisma } from "../../DB/prisma";
import { config } from "../../config/config";
import { BloodGroup, Prisma, UserRole } from "../../../generated/client";
import { sendVerificationEmail } from "../../utils/sendVarificationEmail";

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
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUserByEmail && existingUserByEmail.isVerified) {
    throw new AppError(httpStatus.CONFLICT, "email already exists!");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.salt_rounds),
  );

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour

  let result;

  if (existingUserByEmail) {
    const { profile, ...rest } = payload;
    rest.password = hashedPassword;

    result = await prisma.$transaction(async (tx) => {
      if (profile) {
        profile.dateOfBirth = new Date(profile.dateOfBirth);
        await tx.userProfile.update({
          where: { id: existingUserByEmail.profileId! },
          data: profile,
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: existingUserByEmail.id },
        data: {
          ...rest,
          verifyCode,
          verifyCodeExpiry,
        },
        omit: { password: true },
      });

      return updatedUser;
    });
  } else {
    const { profile, ...rest } = payload;
    rest.password = hashedPassword;
    profile!.dateOfBirth = new Date(profile!.dateOfBirth);

    result = await prisma.$transaction(async (tx) => {
      const createProfile = await tx.userProfile.create({ data: profile! });
      if (!createProfile) {
        throw new AppError(httpStatus.FORBIDDEN, "failed to create user!");
      }

      const user = await tx.user.create({
        data: {
          profileId: createProfile.id,
          ...rest,
          isVerified: false,
          verifyCode,
          verifyCodeExpiry,
        },
        omit: { password: true },
      });
      if (!user) {
        throw new AppError(httpStatus.FORBIDDEN, "failed to create user!");
      }

      return user;
    });
  }

  const emailResponse = await sendVerificationEmail({
    email: result.email,
    username: result.username,
    otp: verifyCode,
  });

  if (!emailResponse.success) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, emailResponse.message);
  }

  return result;
};
const getMe = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
    include: { profile: true },
  });
  console.log("Final result before return:", result);
  return result;
};

const verifyUserIntoDB = async (payload: {
  email: string;
  verifyCode: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already verified");
  }

  const isCodeValid = user.verifyCode === payload.verifyCode;
  const isCodeNotExpired =
    user.verifyCodeExpiry && new Date(user.verifyCodeExpiry) > new Date();

  if (!isCodeValid) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid verification code");
  }

  if (!isCodeNotExpired) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Verification code has expired. Please request a new one.",
    );
  }

  const result = await prisma.user.update({
    where: { email: payload.email },
    data: {
      isVerified: true,
      verifyCode: null,
      verifyCodeExpiry: null,
    },
    omit: { password: true },
  });

  return result;
};

const resendVerificationCodeIntoDB = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already verified");
  }

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verifyCodeExpiry = new Date(Date.now() + 3600000); 

  const result = await prisma.user.update({
    where: { email },
    data: {
      verifyCode,
      verifyCodeExpiry,
    },
    omit: { password: true },
  });

  const emailResponse = await sendVerificationEmail({
    email: result.email,
    username: result.username,
    otp: verifyCode,
  });

  if (!emailResponse.success) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, emailResponse.message);
  }

  return result;
};

export const userServices = {
  isUserExist,
  isPasswordMatched,
  createUserIntoDB,
  getMe,
  verifyUserIntoDB,
  resendVerificationCodeIntoDB,
};
