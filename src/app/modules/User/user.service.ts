import { Request } from "express";
import bcrypt from "bcryptjs";
import { Prisma, User, UserRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { safeUserSelect, TAuthUser, userSearchAbleFields } from "./user.constant";
import { paginationHelper } from "@helpers/paginationHelper";
import prisma from "@utils/prisma";
import AppError from "@middleware/AppError";

type TSafeUser = Pick<User, "id" | "email" | "role" | "name" | "createdAt" | "updatedAt">;

const createUser = async (req: Request): Promise<TSafeUser> => {
  const hashedPassword: string = await bcrypt.hash(req?.body?.password as string, 12);
  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.USER,
    name: req.body.name,
    isVerified: true,
  };

  const existingUser = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (existingUser) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Email already exists. Please use another email."
    );
  }

  const createdUserData = await prisma.user.create({
    data: userData,
    select: safeUserSelect,
  });

  return createdUserData;
};

const createAdmin = async (req: Request): Promise<TSafeUser> => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
    name: req.body.name,
    photo: req.body.photo,
    contactNumber: req.body.contactNumber,
    gender: req.body.gender,
  };

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (existingAdmin) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Email already exists. Please use another email."
    );
  }

  const createdAdminData = await prisma.user.create({
    data: userData,
    select: safeUserSelect,
  });

  return createdAdminData;
};


const getAllUserFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //   For spesific field filter
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
          [options.sortBy]: options.sortOrder,
        }
        : {
          createdAt: "desc",
        },
    select: safeUserSelect,
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUserFromDB = async (id: string) => {
  const userData = prisma.user.findUnique({
    where: {
      id,
    },
    select: safeUserSelect,
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return userData;
};

const myProfile = async (user: any) => {
  const profile = await prisma.user.findUnique({
    where: {
      email: user?.email,
      // status: UserStatus.ACTIVE,
    },
    select: safeUserSelect,
  });

  if (!profile) {
    throw new AppError(StatusCodes.NOT_FOUND, "Active user not found");
  }

  return profile;
};

const changeProfileStatus = async (id: string, status: UserRole) => {
  prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: safeUserSelect,
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
    select: safeUserSelect,
  });

  return updateUserStatus;
};

const updateRole = async (id: string, role: UserRole) => {
  prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: safeUserSelect,
  });

  const updateRole = await prisma.user.update({
    where: {
      id,
    },
    data: role,
    select: safeUserSelect,
  });

  return updateRole;
};

const updateMyProfile = async (user: TAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      // status: UserStatus.ACTIVE,
    },
  });

  // According the role, data will update
  let profileInfo;

  if (userInfo?.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
      select: safeUserSelect,
    });
  } else if (userInfo?.role === UserRole.ADMIN) {
    profileInfo = await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
      select: safeUserSelect,
    });
  } else if (userInfo?.role === UserRole.USER) {
    profileInfo = await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
      select: safeUserSelect,
    });
  }

  return { ...profileInfo };
};

export const UserService = {
  createUser,
  createAdmin,
  getAllUserFromDB,
  getSingleUserFromDB,
  myProfile,
  changeProfileStatus,
  updateRole,
  updateMyProfile,
};
