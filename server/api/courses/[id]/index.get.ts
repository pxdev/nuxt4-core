import { useDB } from "../../../utils/db";

export default defineEventHandler(async (event): Promise<CourseDetail> => {
  const session = await requireUserSession(event);
  const DB = useDB();
  const { id } = getRouterParams(event);
  const courseId = Number.parseInt(id, 10);

  if (!Number.isFinite(courseId) || courseId <= 0) {
    throw createError({ statusCode: 400, message: "Course id must be a positive number" });
  }

  const enrollment = await DB.userCourse.findFirst({
    where: {
      userId: session.user.id,
      courseId
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          thumbnail: true,
          liveRoomLink: true
        }
      },
      activeLevel: {
        select: {
          id: true,
          courseId: true,
          label: true,
          description: true,
          sortOrder: true,
          meetingFrequency: true
        }
      }
    }
  });

  if (!enrollment) {
    throw createError({ statusCode: 404, message: "Course not found" });
  }

  const levelRows = await DB.courseLevel.findMany({
    where: { courseId },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: {
          lectures: true
        }
      }
    }
  });

  const normalizedLevels = levelRows.map((level) => ({
    id: level.id,
    courseId: level.courseId,
    label: level.label,
    description: level.description,
    sortOrder: level.sortOrder,
    meetingFrequency: level.meetingFrequency,
    lectureCount: level._count.lectures
  }));

  const activeLevelId = enrollment.activeLevelId ?? normalizedLevels[0]?.id ?? null;

  const lectures = activeLevelId
    ? await DB.courseLecture.findMany({
        where: {
          courseId,
          levelId: activeLevelId
        },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          levelId: true,
          courseId: true,
          title: true,
          description: true,
          sortOrder: true,
          durationMinutes: true,
          resourceLink: true,
          startsAt: true
        }
      })
    : [];

  const activeLevel =
    activeLevelId && normalizedLevels.length
      ? normalizedLevels.find((level) => level.id === activeLevelId) ?? null
      : null;

  return {
    id: enrollment.course.id,
    title: enrollment.course.title,
    slug: enrollment.course.slug,
    description: enrollment.course.description,
    thumbnail: enrollment.course.thumbnail,
    status: enrollment.status,
    purchasedAt: Number(enrollment.purchasedAt),
    liveRoomLink: enrollment.course.liveRoomLink,
    startedAt: enrollment.startedAt ? Number(enrollment.startedAt) : null,
    completedAt: enrollment.completedAt ? Number(enrollment.completedAt) : null,
    level: activeLevel,
    levels: normalizedLevels,
    lectures: lectures.map((lecture) => ({
      id: lecture.id,
      levelId: lecture.levelId,
      courseId: lecture.courseId,
      title: lecture.title,
      description: lecture.description,
      sortOrder: lecture.sortOrder,
      durationMinutes: lecture.durationMinutes,
      resourceLink: lecture.resourceLink,
      startsAt: lecture.startsAt ? Number(lecture.startsAt) : null
    }))
  };
});
