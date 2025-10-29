import slugify from "slugify";
import { useDB, now, normalizeBigInt } from "../../../../utils/db";
import { requireAdminSession } from "../../../../utils/admin";

const sanitizeDuration = (value) => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null || value === "") {
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
  const { id } = getRouterParams(event);
  const courseId = Number.parseInt(id, 10);

  if (!Number.isFinite(courseId) || courseId <= 0) {
    throw createError({ statusCode: 400, message: "Course id must be a positive number" });
  }

  const body = await readBody(event);
  const db = useDB();

  const existing = await db.course.findUnique({
    where: { id: courseId }
  });

  if (!existing) {
    throw createError({ statusCode: 404, message: "Course not found" });
  }

  const data = {};

  if (body?.title !== undefined) {
    const title = body.title?.trim();
    if (!title) {
      throw createError({ statusCode: 422, message: "Title cannot be empty" });
    }
    data.title = title;
  }

  if (body?.slug !== undefined) {
    const slugSource = body.slug?.trim() || (body.title ?? "").trim();
    if (!slugSource) {
      throw createError({ statusCode: 422, message: "Slug cannot be empty" });
    }

    const newSlug = slugify(slugSource, { lower: true, strict: true });
    if (!newSlug) {
      throw createError({ statusCode: 422, message: "Slug could not be generated" });
    }

    if (newSlug !== existing.slug) {
      const slugConflict = await db.course.findUnique({
        where: { slug: newSlug },
        select: { id: true }
      });

      if (slugConflict && slugConflict.id !== courseId) {
        throw createError({ statusCode: 409, message: "Slug already exists. Please choose another one." });
      }
    }

    data.slug = newSlug;
  }

  if (body?.description !== undefined) {
    data.description = body.description ?? null;
  }

  if (body?.thumbnail !== undefined) {
    data.thumbnail = body.thumbnail ?? null;
  }

  if (body?.levelStrategy !== undefined) {
    data.levelStrategy = body.levelStrategy ?? null;
  }

  if (body?.liveRoomLink !== undefined) {
    data.liveRoomLink = body.liveRoomLink ?? null;
  }

  const durationMinutes = sanitizeDuration(body?.durationMinutes);
  if (durationMinutes !== undefined) {
    data.durationMinutes = durationMinutes;
  }

  if (Object.keys(data).length) {
    data.updatedAt = now();

    await db.course.update({
      where: { id: courseId },
      data
    });
  }

  const refreshed = await db.course.findUnique({
    where: { id: courseId }
  });

  return normalizeBigInt(refreshed ?? existing);
});
