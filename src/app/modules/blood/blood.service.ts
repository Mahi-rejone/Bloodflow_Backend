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

export const bloodServices = {
  createBloodRequest,
  getAllPendingRequests,
  getBloodRequestById, 
};

