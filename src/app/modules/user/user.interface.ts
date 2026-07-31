import { User, UserRole } from "@prisma/client";

// TUser is just Prisma's generated User type — no need to hand-write it
export type TUser = User;
export type TUser_Role = UserRole;
