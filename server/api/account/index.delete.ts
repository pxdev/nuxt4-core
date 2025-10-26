import { useDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const DB = useDB();
  try {
    await DB.user.delete({
      where: { id: user.id }
    });
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, data: { success: false } });
  }
  return { success: true };
});
