import bcrypt from "bcryptjs";
import { normalizeBigInt, now, useDB } from "../../utils/db";

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
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: "Email already registered"
      });
    }

    // Check if username is taken (if provided)
    if (username) {
      const existingUsername = await db.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive"
          }
        },
        select: { id: true }
      });

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

    const timestamp = now();

    const newUser = await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        birthday: true,
        country: true,
        aboutMe: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const normalizedUser = normalizeBigInt(newUser);

    // Create session
    await setUserSession(event, {
      user: normalizedUser
    });

    return {
      success: true,
      user: normalizedUser
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An error occurred during registration"
    });
  }
});
