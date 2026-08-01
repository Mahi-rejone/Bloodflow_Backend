import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { userServices } from "./user.service.js";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse.js";

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await userServices.createUserIntoDB(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User successfully created",
    data: result,
  });
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

export const userController = {
  createUser,
  getMe
};
