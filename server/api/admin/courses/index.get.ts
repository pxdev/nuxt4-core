import { useDB, normalizeBigInt } from "../../../utils/db";
import { requireAdminSession } from "../../../utils/admin";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);
  const db = useDB();

  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          levels: true,
          lectures: true,
          enrollments: true
        }
      }
    }
  });

  return courses.map((course) => {
    const normalized = normalizeBigInt(course);
    const { _count, ...rest } = normalized;
    return {
      ...rest,
      levelCount: _count?.levels ?? 0,
      lectureCount: _count?.lectures ?? 0,
      enrollmentCount: _count?.enrollments ?? 0
    };
  });
});
