import { normalizeBigInt, now, toBigInt, useDB } from "../../../utils/db";
import { requireAdminSession } from "../../../utils/admin";

export default defineEventHandler(async (event) => {
  const session = await requireAdminSession(event);
  const body = await readBody(event);
  const db = useDB();
  const timestamp = now();

  const {
    title,
    slug,
    content,
    status = "draft",
    excerpt,
    coverImage,
    seoTitle,
    seoDescription,
    seoKeywords,
    publishedAt
  } = body ?? {};

  if (!title || !content) {
    throw createError({
      statusCode: 400,
      data: { message: "Title and content are required" }
    });
  }

  const resolvedSlug = slug?.trim() || title.toLowerCase().replace(/\s+/g, "-");

  try {
    const created = await db.page.create({
      data: {
        title: title.trim(),
        slug: resolvedSlug,
        content: content.trim(),
        status,
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage?.trim() || null,
        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null,
        seoKeywords: seoKeywords?.trim() || null,
        authorId: session.user.id,
        publishedAt: status === "published" ? toBigInt(publishedAt ?? Number(timestamp)) : toBigInt(publishedAt),
        createdAt: timestamp,
        updatedAt: timestamp
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
        publishedAt: true
      }
    });

    return normalizeBigInt(created);
  } catch (error) {
    console.error("Failed to create page", error);
    throw createError({
      statusCode: 500,
      data: { message: "Unable to create page" }
    });
  }
});
