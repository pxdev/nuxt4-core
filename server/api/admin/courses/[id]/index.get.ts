import { useDB, normalizeBigInt } from "../../../../utils/db";
import { requireAdminSession } from "../../../../utils/admin";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);
  const { id } = getRouterParams(event);
  const courseId = Number.parseInt(id, 10);

  if (!Number.isFinite(courseId) || courseId <= 0) {
    throw createError({ statusCode: 400, message: "Course id must be a positive number" });
  }

  const db = useDB();
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      levels: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          label: true,
          sortOrder: true
        }
      },
      _count: {
        select: {
          levels: true,
          lectures: true,
          enrollments: true
        }
      }
    }
  });

  if (!course) {
    throw createError({ statusCode: 404, message: "Course not found" });
  }

  const normalized = normalizeBigInt(course);
  const { _count, ...rest } = normalized;

  return {
    ...rest,
    levelCount: _count?.levels ?? 0,
    lectureCount: _count?.lectures ?? 0,
    enrollmentCount: _count?.enrollments ?? 0
  };
});
