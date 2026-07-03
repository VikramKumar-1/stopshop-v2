import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken, TokenPayload } from "@/lib/auth";

/**
 * Service containing the business and database logic for authentication.
 * Keeps controllers under src/app/api/auth decoupled from db operations.
 */

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = signToken(payload);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

export async function registerUser(name: string, email: string, password: string, role?: string) {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  const targetRole = role === "vendor" ? "vendor" : "user";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (targetRole === "vendor" && existingUser.role === "user") {
      // User exists as a regular user, check password to upgrade their role
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        throw new Error("Email is already registered. If this is you, please use your correct password to upgrade your account.");
      }

      // Upgrade role
      const upgradedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: "vendor" },
      });

      const payload: TokenPayload = {
        userId: upgradedUser.id,
        email: upgradedUser.email,
        role: upgradedUser.role,
      };

      const token = signToken(payload);

      return {
        user: {
          id: upgradedUser.id,
          name: upgradedUser.name,
          email: upgradedUser.email,
          role: upgradedUser.role,
        },
        token,
      };
    } else {
      throw new Error("Email is already registered");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: targetRole,
    },
  });

  const payload: TokenPayload = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const token = signToken(payload);

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  };
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new Error("User profile not found");
  }

  return user;
}
