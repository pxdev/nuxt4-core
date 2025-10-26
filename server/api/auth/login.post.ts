import bcrypt from "bcryptjs";
import { normalizeBigInt, useDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const { email, password } = await readBody(event);

    // Validate inputs
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: "Email and password are required"
      });
    }

    // Get user from database
    const db = useDB();
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        password: true,
        birthday: true,
        country: true,
        aboutMe: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password"
      });
    }

    // Verify password
    const isPasswordValid = user.password && await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password"
      });
    }

    // Create session
    const { password: _, ...userWithoutPassword } = user;
    const normalizedUser = normalizeBigInt(userWithoutPassword);
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
      message: error.message || "An error occurred during login"
    });
  }
});
