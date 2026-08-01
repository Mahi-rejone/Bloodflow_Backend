import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { TLogin } from "./auth.interface";
import { authServices } from "./auth.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

const UserLogin: RequestHandler = catchAsync(async (req, res) => {
  const user: TLogin = req.body;
  const { accessToken, refreshToken } = await authServices.login(user);
  res.cookie("accessToken", accessToken, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: accessToken,
  });
});

const userLogout: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged out successfully",
      data: null,
    });
  },
);

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.RefreshToken(refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User access token fetched successfully",
    data: result,
  });
});

const changePassword: RequestHandler = catchAsync(async (req, res) => {
  const password = req.body;
  const result = await authServices.ChangePassword(req.user, password);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

export const authController = {
  UserLogin,
  userLogout,
  refreshToken,
  changePassword,
};
