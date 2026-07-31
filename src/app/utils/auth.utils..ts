import jwt, { JwtPayload } from "jsonwebtoken";
import ms from "ms";
import { TUser_Role } from "../modules/user/user.interface.js";

export const createToken = (
  jwtPayload: {
    id: string;
    role: TUser_Role;
    email: string;
  },
  secret: string,
  expiresIn: ms.StringValue,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
