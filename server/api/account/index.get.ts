import { useDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const DB = useDB();
  const { username } = getQuery<{ username: string }>(event);
  if (username) {
    const existingUser = await DB.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive"
        }
      },
      select: { id: true }
    });
    if (existingUser) throw createError({ statusCode: 400, data: { success: false, message: "Username already in use" } });
  }
  return { success: true };
});
