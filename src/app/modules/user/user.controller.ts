import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { userServices } from "./user.service.js";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse.js";

const createUser: RequestHandler = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    const result = await userServices.createUserIntoDB(data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User successfully created",
      data: result,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create user",
      data: null,
    });
  }
});

const getMe: RequestHandler = catchAsync(async (req, res) => {
  const data = req.user;
  const result = await userServices.getMe(data.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const verifyUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await userServices.verifyUserIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Account verified successfully",
    data: result,
  });
});

const resendVerificationCode: RequestHandler = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await userServices.resendVerificationCodeIntoDB(email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Verification code resent successfully",
    data: result,
  });
});

const getAllDonors = catchAsync(async (req, res) => {
  const { bloodGroup, district, town, state, search } = req.query;
  const result = await userServices.getAllDonors({
    bloodGroup: bloodGroup as any,
    district: district as string,
    town: town as string,
    state: state as string,
    search: search as string,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donors retrieved successfully",
    data: result,
  });
});

const getDonorById = catchAsync(async (req, res) => {
  const result = await userServices.getDonorById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donor profile retrieved successfully",
    data: result,
  });
});


export const userController = {
  createUser,
  getMe,
  verifyUser,
  resendVerificationCode,
  getAllDonors,
  getDonorById,
};

