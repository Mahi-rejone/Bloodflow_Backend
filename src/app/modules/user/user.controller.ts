import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { TUser } from "./user.interface.js";
import { userServices } from "./user.service.js";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse.js";

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const data: TUser = req.body;
  const result = await userServices.createUserIntoDB(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User successfully created",
    data: result,
  });
});

export const userController = {
  createUser,
};
