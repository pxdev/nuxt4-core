// filepath: /Users/aamin/Development/realestate/app/server/api/auth/login.post.ts
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { useDB, tables } from "../../utils/db";

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
    const user = await db.select({
      id: tables.users.id,
      name: tables.users.name,
      username: tables.users.username,
      email: tables.users.email,
      password: tables.users.password,
      birthday: tables.users.birthday,
      country: tables.users.country,
      aboutMe: tables.users.aboutMe,
      createdAt: tables.users.createdAt,
      updatedAt: tables.users.updatedAt
    }).from(tables.users)
      .where(eq(tables.users.email, email))
      .get();

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
    await setUserSession(event, {
      user: userWithoutPassword
    });

    return {
      success: true,
      user: userWithoutPassword
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An error occurred during login"
    });
  }
});
