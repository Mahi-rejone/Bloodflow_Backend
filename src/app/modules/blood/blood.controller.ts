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

const acceptBloodRequest: RequestHandler = catchAsync(async (req, res) => {
  const result = await bloodServices.acceptBloodRequest(
    req.user.id,
    req.params.id as string,
    req.body.units,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contribution accepted successfully",
    data: result,
  });
});

const getCompletedRequestsCount = catchAsync(async (req, res) => {
  const result = await bloodServices.getCompletedRequestsCount();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Completed requests count retrieved successfully",
    data: { count: result },
  });
});

const getMyDonations: RequestHandler = catchAsync(async (req, res) => {
  const result = await bloodServices.getMyDonations(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your completed donations retrieved successfully",
    data: result,
  });
});

const getMyRequests: RequestHandler = catchAsync(async (req, res) => {
  const result = await bloodServices.getMyRequests(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your blood requests retrieved successfully",
    data: result,
  });
});

const getMyPendingDonations: RequestHandler = catchAsync(async (req, res) => {
  const result = await bloodServices.getMyPendingDonations(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your pending donations retrieved successfully",
    data: result,
  });
});

export const bloodController = {
  BloodRequest,
  getBloodRequestById,
  createBloodRequest,
  acceptBloodRequest,
  getCompletedRequestsCount,
  getMyDonations,
  getMyRequests,
  getMyPendingDonations,
};
