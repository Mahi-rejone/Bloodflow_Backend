import bcrypt from "bcrypt";
import { prisma } from "./prisma.js";
import { config } from "../config/config.js";
import { UserRole, UserStatus } from "../../generated/enums.js";

const seedAdmin = async () => {
  const isAdminExists = await prisma.user.findFirst({
    where: { role: UserRole.ADMIN },
  });

  if (!isAdminExists) {
    const hashedPassword = await bcrypt.hash(
      process.env.PASSWORD as string,
      Number(config.salt_rounds) || 10,
    );

    await prisma.user.create({
      data: {
        username: process.env.NAME as string,
        email: process.env.EMAIL as string,
        password: hashedPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        isDeleted: false,
      },
    });
  }
};

export default seedAdmin;
