import { useDB } from "../../../../utils/db";
import { requireAdminSession } from "../../../../utils/admin";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);
  const db = useDB();
  const id = Number.parseInt(getRouterParam(event, "id") ?? "", 10);

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, data: { message: "Invalid page id" } });
  }

  try {
    await db.page.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete page", error);
    throw createError({ statusCode: 500, data: { message: "Unable to delete page" } });
  }
});
