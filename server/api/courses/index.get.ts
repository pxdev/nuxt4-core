import { useDB } from "../../utils/db";

export default defineEventHandler(async (event): Promise<CourseSummary[]> => {
  const session = await requireUserSession(event);
  const DB = useDB();

  const assignments = await DB.userCourse.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          thumbnail: true
        }
      },
      activeLevel: {
        select: {
          id: true,
          label: true,
          sortOrder: true
        }
      }
    },
    orderBy: { purchasedAt: "desc" }
  });

  return assignments.map((assignment) => ({
    id: assignment.course.id,
    title: assignment.course.title,
    slug: assignment.course.slug,
    description: assignment.course.description,
    thumbnail: assignment.course.thumbnail,
    status: assignment.status,
    purchasedAt: Number(assignment.purchasedAt),
    level: assignment.activeLevel
      ? {
          id: assignment.activeLevel.id,
          label: assignment.activeLevel.label ?? "",
          sortOrder: assignment.activeLevel.sortOrder ?? 0
        }
      : null
  }));
});
