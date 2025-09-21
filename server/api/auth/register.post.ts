// filepath: /Users/aamin/Development/realestate/app/server/api/auth/register.post.ts
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { useDB, tables } from "../../utils/db";

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const { name, username, email, password } = await readBody(event);

    // Validate inputs
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: "Email and password are required"
      });
    }

    // Check if user already exists
    const db = useDB();
    const existingUser = await db.select({ id: tables.users.id })
      .from(tables.users)
      .where(eq(tables.users.email, email))
      .get();

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: "Email already registered"
      });
    }

    // Check if username is taken (if provided)
    if (username) {
      const existingUsername = await db.select({ id: tables.users.id })
        .from(tables.users)
        .where(eq(tables.users.username, username))
        .get();

      if (existingUsername) {
        throw createError({
          statusCode: 409,
          message: "Username already taken"
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const now = Date.now();

    // Create user
    const newUser = await db.insert(tables.users)
      .values({
        name,
        username,
        email,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now
      })
      .returning({
        id: tables.users.id,
        name: tables.users.name,
        username: tables.users.username,
        email: tables.users.email,
        birthday: tables.users.birthday,
        country: tables.users.country,
        aboutMe: tables.users.aboutMe,
        createdAt: tables.users.createdAt,
        updatedAt: tables.users.updatedAt
      })
      .get();

    if (!newUser) {
      throw createError({
        statusCode: 500,
        message: "Failed to create user"
      });
    }

    // Create session
    await setUserSession(event, {
      user: newUser
    });

    return {
      success: true,
      user: newUser
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An error occurred during registration"
    });
  }
});
