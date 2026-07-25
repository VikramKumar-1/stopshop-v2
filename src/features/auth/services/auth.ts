import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { signToken, TokenPayload } from "@/lib/auth";

/**
 * Service containing the business and database logic for authentication.
 * Keeps controllers under src/app/api/auth decoupled from db operations.
 */

// ─── Password Validation ─────────────────────────────────────────────────────
const MIN_PASSWORD_LENGTH = 5;

function validatePassword(password: string): void {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
}

// ─── OAuth Placeholder Detection ──────────────────────────────────────────────
// SECURITY: Known placeholder used in older OAuth registrations.
// Block email/password login for these accounts.
const LEGACY_OAUTH_PLACEHOLDER = "google_oauth_placeholder_password";

async function isOAuthPlaceholderPassword(hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(LEGACY_OAUTH_PLACEHOLDER, hashedPassword);
  } catch {
    return false;
  }
}

export async function loginUser(email: string, password: string, rememberMe?: boolean) {
  if (!email || !password) {
    throw new Error("Invalid email or password");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // SECURITY: Block email/password login for OAuth-only accounts
  if (await isOAuthPlaceholderPassword(user.password)) {
    throw new Error("This account uses Google Sign-In. Please login with Google.");
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

  const token = signToken(payload, rememberMe);

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

export async function registerUser(name: string, email: string, password: string, role?: string, rememberMe?: boolean, inviteCode?: string) {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  // SECURITY: Validate password strength
  validatePassword(password);

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

      const token = signToken(payload, rememberMe);

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

  const token = signToken(payload, rememberMe);

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

/**
 * Generate a cryptographically random password for OAuth users.
 * This password is unguessable and prevents email/password login.
 */
export function generateSecureOAuthPassword(): string {
  return crypto.randomBytes(32).toString("base64url");
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
