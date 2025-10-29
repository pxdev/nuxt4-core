import slugify from "slugify";
import { useDB, now, normalizeBigInt } from "../../../utils/db";
import { requireAdminSession } from "../../../utils/admin";

const sanitizeDuration = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric < 0) {
    throw createError({ statusCode: 422, message: "Duration must be a positive number" });
  }
  return numeric;
};

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);
  const body = await readBody(event);

  const title = body?.title?.trim();
  if (!title) {
    throw createError({ statusCode: 422, message: "Title is required" });
  }

  const db = useDB();
  const timestamp = now();

  const slugSource = body?.slug?.trim() || title;
  const slug = slugify(slugSource, { lower: true, strict: true });
  if (!slug) {
    throw createError({ statusCode: 422, message: "Slug could not be generated" });
  }

  const existing = await db.course.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (existing) {
    throw createError({ statusCode: 409, message: "Slug already exists. Please choose another one." });
  }

  const durationMinutes = sanitizeDuration(body?.durationMinutes);

  const created = await db.course.create({
    data: {
      title,
      slug,
      description: body?.description ?? null,
      thumbnail: body?.thumbnail ?? null,
      levelStrategy: body?.levelStrategy ?? null,
      liveRoomLink: body?.liveRoomLink ?? null,
      durationMinutes,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  });

  return normalizeBigInt(created);
});
