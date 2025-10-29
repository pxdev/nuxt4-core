import { useDB } from "../../../../utils/db";
import { requireAdminSession } from "../../../../utils/admin";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);
  const { id } = getRouterParams(event);
  const courseId = Number.parseInt(id, 10);

  if (!Number.isFinite(courseId) || courseId <= 0) {
    throw createError({ statusCode: 400, message: "Course id must be a positive number" });
  }

  const db = useDB();
  const existing = await db.course.findUnique({
    where: { id: courseId },
    select: { id: true }
  });

  if (!existing) {
    throw createError({ statusCode: 404, message: "Course not found" });
  }

  await db.course.delete({
    where: { id: courseId }
  });

  return { success: true };
});
