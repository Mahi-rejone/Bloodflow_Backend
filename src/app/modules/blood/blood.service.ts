import { prisma } from "../../DB/prisma";
import { BloodGroup } from "../../../generated/client";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const createBloodRequest = async (
  requesterId: string,
  payload: {
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    hospital: string;
    state: string;
    district: string;
    town: string;
    address: string;
    neededAt: Date;
  },
) => {
  const result = await prisma.bloodRequest.create({
    data: {
      ...payload,
      requesterId,
    },
  });
  return result;
};

const getAllPendingRequests = async () => {
  const result = await prisma.bloodRequest.findMany({
    where: {
      status: "PENDING",
      isDeleted: false,
    },
    orderBy: { neededAt: "asc" },
    include: {
      requester: {
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
  return result;
};

const getBloodRequestById = async (id: string) => {
  const result = await prisma.bloodRequest.findFirst({
    where: { id, isDeleted: false },
    include: {
      requester: {
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
          profile: {
            select: { phoneNumber: true, bloodGroup: true },
          },
        },
      },
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Blood request not found!");
  }
  return result;
};

const acceptBloodRequest = async (
  donorId: string,
  requestId: string,
  unitsDonated: number,
) => {
  const request = await prisma.bloodRequest.findFirst({
    where: { id: requestId, isDeleted: false },
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Blood request not found!");
  }

  if (request.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This request is no longer accepting donations.",
    );
  }

  if (request.requesterId === donorId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't donate to your own request.",
    );
  }

  const existingPending = await prisma.bloodDonationHistory.findFirst({
    where: { donorId, reqId: requestId, status: "PENDING" },
  });

  if (existingPending) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have a pending contribution on this request. Wait for it to be confirmed before contributing again.",
    );
  }

  if (unitsDonated > request.unitsNeeded) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Only ${request.unitsNeeded} unit(s) still needed for this request.`,
    );
  }

  const remaining = request.unitsNeeded - unitsDonated;

  const result = await prisma.$transaction(async (tx) => {
    const donation = await tx.bloodDonationHistory.create({
      data: {
        donorId,
        recipientId: request.requesterId,
        reqId: requestId,
        unitDonated: unitsDonated,
      },
    });

    const updatedRequest = await tx.bloodRequest.update({
      where: { id: requestId },
      data: {
        unitsNeeded: remaining,
        status: remaining === 0 ? "IN_PROGRESS" : "PENDING",
      },
    });

    return { donation, request: updatedRequest };
  });

  return result;
};

const getCompletedRequestsCount = async () => {
  const count = await prisma.bloodRequest.count({
    where: {
      status: "COMPLETE",
      isDeleted: false,
    },
  });
  return count;
};

const getMyDonations = async (donorId: string) => {
  const result = await prisma.bloodDonationHistory.findMany({
    where: { donorId, status: "CONFIRMED" },
    orderBy: { donationDate: "desc" },
    include: {
      recipient: {
        select: { id: true, username: true, fullName: true },
      },
      bloodRequest: {
        select: {
          id: true,
          hospital: true,
          bloodGroup: true,
          state: true,
          district: true,
          town: true,
        },
      },
    },
  });
  return result;
};

const getMyRequests = async (requesterId: string) => {
  const result = await prisma.bloodRequest.findMany({
    where: { requesterId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      donationHistory: {
        select: {
          id: true,
          donorId: true,
          status: true,
          unitDonated: true,
          donationDate: true,
        },
      },
    },
  });
  return result;
};

const getMyPendingDonations = async (donorId: string) => {
  const result = await prisma.bloodDonationHistory.findMany({
    where: { donorId, status: "PENDING" },
    orderBy: { donationDate: "desc" },
    include: {
      recipient: {
        select: { id: true, username: true, fullName: true },
      },
      bloodRequest: {
        select: {
          id: true,
          hospital: true,
          bloodGroup: true,
          state: true,
          district: true,
          town: true,
          status: true,
        },
      },
    },
  });
  return result;
};

export const bloodServices = {
  createBloodRequest,
  getAllPendingRequests,
  getBloodRequestById,
  acceptBloodRequest,
  getCompletedRequestsCount,
  getMyDonations,
  getMyRequests,
  getMyPendingDonations,
};
