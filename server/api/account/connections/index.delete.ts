import { useDB } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { provider } = getQuery(event);
  const DB = useDB();
  const result = await DB.socialConnection.deleteMany({
    where: {
      userId: user.id,
      provider: String(provider)
    }
  });
  if (!result.count) {
    throw createError({
      statusCode: 400,
      data: { success: false, message: "Failed to delete connection" }
    });
  }
  return { success: true, message: "Connection deleted successfully" };
});
