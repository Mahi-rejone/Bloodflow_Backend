import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { bloodServices } from "./blood.service";

const createBloodRequest: RequestHandler = catchAsync(async (req, res) => {
  const result = await bloodServices.createBloodRequest(
    req.user.id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Blood request created successfully",
    data: result,
  });
});

const BloodRequest: RequestHandler = catchAsync(async (req, res) => {
  const data = req.user;
  const result = await bloodServices.getAllPendingRequests();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Requests retrieved successfully",
    data: result,
  });
});

const getBloodRequestById = catchAsync(async (req, res) => {
  const result = await bloodServices.getBloodRequestById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blood request fetched successfully",
    data: result,
  });
});

export const bloodController = {
  BloodRequest,
  getBloodRequestById,
  createBloodRequest,
};