import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "USER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export enum isActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: string;
  isVerified?: string;
  role: Role;

  auths: IAuthProvider[];

  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
