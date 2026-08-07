import { RequestHandler } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { eventServices } from "./event.service";

const createEvent: RequestHandler = catchAsync(async (req, res) => {
  const result = await eventServices.createEvent(req.user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Event created successfully",
    data: result,
  });
});

const getAllEvents: RequestHandler = catchAsync(async (req, res) => {
  const result = await eventServices.getAllEvents();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Events retrieved successfully",
    data: result,
  });
});

const getEventById: RequestHandler = catchAsync(async (req, res) => {
  const result = await eventServices.getEventById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event retrieved successfully",
    data: result,
  });
});

const updateEvent: RequestHandler = catchAsync(async (req, res) => {
  const result = await eventServices.updateEvent(
    req.params.id as string,
    req.user.id,
    req.user.role,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event updated successfully",
    data: result,
  });
});

const deleteEvent: RequestHandler = catchAsync(async (req, res) => {
  await eventServices.deleteEvent(req.params.id as string, req.user.id, req.user.role);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event deleted successfully",
    data: null,
  });
});

export const eventController = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
