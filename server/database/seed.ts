import "dotenv/config";
import { useDB, now, toBigInt } from "../utils/db";

type LectureSeed = {
  title: string;
  description: string | null;
  sortOrder?: number;
  durationMinutes: number | null;
  resourceLink: string | null;
  startsAt: number | null;
};

type LevelSeed = {
  label: string;
  description: string | null;
  sortOrder?: number;
  meetingFrequency: string | null;
  lectures: LectureSeed[];
};

type CourseSeed = {
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  levelStrategy: string | null;
  liveRoomLink: string | null;
  durationMinutes: number | null;
  levels: LevelSeed[];
};

const db = useDB();

const courses: CourseSeed[] = [
  {
    title: 'Personalized English Coaching',
    slug: 'personalized-english-coaching',
    description: 'One-on-one coaching focused on business conversation fluency.',
    thumbnail: '/images/courses/english-coaching.jpg',
    levelStrategy: 'progressive',
    liveRoomLink: 'https://meet.example.com/english-coaching',
    durationMinutes: 90,
    levels: [
      {
        label: 'Level One',
        description: 'Foundation sessions covering tone, clarity, and confidence building.',
        meetingFrequency: 'twice-weekly',
        lectures: [
          {
            title: 'Confidence Kickoff',
            description: 'Assess speaking baseline and set learning goals.',
            durationMinutes: 60,
            resourceLink: 'https://cdn.example.com/resources/confidence.pdf',
            startsAt: null
          },
          {
            title: 'Everyday Scenarios',
            description: 'Role-play common conversations for travel and daily life.',
            durationMinutes: 75,
            resourceLink: null,
            startsAt: null
          }
        ]
      },
      {
        label: 'Level Two',
        description: 'Applied practice with business-specific feedback loops.',
        meetingFrequency: 'weekly',
        lectures: [
          {
            title: 'Pitch Review',
            description: 'Refine a real-world presentation with live corrections.',
            durationMinutes: 90,
            resourceLink: 'https://cdn.example.com/resources/pitch-template.docx',
            startsAt: null
          }
        ]
      }
    ]
  },
  {
    title: 'Executive Arabic Immersion',
    slug: 'executive-arabic-immersion',
    description: 'Accelerated Arabic coaching tailored for real estate negotiations.',
    thumbnail: '/images/courses/arabic-immersion.jpg',
    levelStrategy: 'adaptive',
    liveRoomLink: 'https://meet.example.com/arabic-immersion',
    durationMinutes: 120,
    levels: [
      {
        label: 'Level One',
        description: 'Introduction to dialect variations and listening drills.',
        meetingFrequency: 'weekly',
        lectures: [
          {
            title: 'Dialect Discovery',
            description: 'Contrast MSA with Gulf dialect for key terms.',
            durationMinutes: 80,
            resourceLink: null,
            startsAt: null
          }
        ]
      },
      {
        label: 'Level Two',
        description: 'Negotiation simulations with market terminology.',
        meetingFrequency: 'weekly',
        lectures: [
          {
            title: 'Offer Workshop',
            description: 'Simulate a property offer call entirely in Arabic.',
            durationMinutes: 110,
            resourceLink: 'https://cdn.example.com/resources/offer-phrases.pdf',
            startsAt: null
          },
          {
            title: 'Objection Handling',
            description: 'Handle counter-offers with confident responses.',
            durationMinutes: 70,
            resourceLink: null,
            startsAt: null
          }
        ]
      }
    ]
  }
];

async function resetCourseData() {
  await db.courseLecture.deleteMany();
  await db.courseLevel.deleteMany();
  await db.userCourse.deleteMany();
  await db.course.deleteMany();
}

async function seedCourses(): Promise<number[]> {
  const ids: number[] = [];

  for (const course of courses) {
    const { levels, ...courseValues } = course;
    const createdCourse = await db.course.create({
      data: {
        title: courseValues.title,
        slug: courseValues.slug,
        description: courseValues.description,
        thumbnail: courseValues.thumbnail,
        levelStrategy: courseValues.levelStrategy,
        liveRoomLink: courseValues.liveRoomLink,
        durationMinutes: courseValues.durationMinutes,
        createdAt: now(),
        updatedAt: now()
      }
    });
    const courseId = createdCourse.id;

    for (const [index, level] of levels.entries()) {
      const { lectures, ...levelValues } = level;
      const createdLevel = await db.courseLevel.create({
        data: {
          courseId,
          label: levelValues.label,
          description: levelValues.description,
          sortOrder: levelValues.sortOrder ?? index + 1,
          meetingFrequency: levelValues.meetingFrequency,
          createdAt: now(),
          updatedAt: now()
        }
      });
      const levelId = createdLevel.id;

      for (const [lectureIndex, lecture] of lectures.entries()) {
        await db.courseLecture.create({
          data: {
            courseId,
            levelId,
            title: lecture.title,
            description: lecture.description,
            sortOrder: lecture.sortOrder ?? lectureIndex + 1,
            durationMinutes: lecture.durationMinutes,
            resourceLink: lecture.resourceLink,
            startsAt: toBigInt(lecture.startsAt),
            createdAt: now(),
            updatedAt: now()
          }
        });
      }
    }

    ids.push(courseId);
  }

  return ids;
}

async function enrollFirstUser(courseIds: number[]) {
  const existingUser = await db.user.findFirst({
    select: { id: true },
    orderBy: { id: "asc" }
  });

  if (!existingUser) {
    console.warn('No users found. Skipping user_courses seeding. Create a user then rerun if needed.');
    return;
  }

  for (const [index, courseId] of courseIds.entries()) {
    await db.userCourse.create({
      data: {
        userId: existingUser.id,
        courseId,
        activeLevelId: null,
        status: 'active',
        purchaseReference: `SEED-${courseId}-${existingUser.id}`,
        purchasedAt: now() - BigInt(index) * BigInt(86_400_000),
        startedAt: null,
        completedAt: null,
        createdAt: now(),
        updatedAt: now()
      }
    });
  }

  console.log(`Assigned ${courseIds.length} course(s) to user ${existingUser.id}.`);
}

async function main() {
  let exitCode = 0;
  try {
    console.log('Resetting course data...');
    await resetCourseData();
    console.log('Creating sample courses...');
    const courseIds = await seedCourses();
    await enrollFirstUser(courseIds);
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
    exitCode = 1;
  } finally {
    await db.$disconnect();
    process.exit(exitCode);
  }
}

main();
