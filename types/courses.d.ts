interface CourseLevelSummary {
  id: number;
  courseId: number;
  label: string;
  description: string | null;
  sortOrder: number;
  meetingFrequency: string | null;
  lectureCount: number;
}

interface CourseLecture {
  id: number;
  levelId: number;
  courseId: number;
  title: string;
  description: string | null;
  sortOrder: number;
  durationMinutes: number | null;
  resourceLink: string | null;
  startsAt: number | null;
}

interface CourseSummary {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  status: string;
  purchasedAt: number;
  level: Pick<CourseLevelSummary, "id" | "label" | "sortOrder"> | null;
}

interface CourseDetail extends CourseSummary {
  liveRoomLink: string | null;
  startedAt: number | null;
  completedAt: number | null;
  level: CourseLevelSummary | null;
  levels: CourseLevelSummary[];
  lectures: CourseLecture[];
}
