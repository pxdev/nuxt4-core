import { normalizeBigInt, now, toBigInt, useDB } from "../../../../utils/db";
import { requireAdminSession } from "../../../../utils/admin";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);
  const db = useDB();
  const id = Number.parseInt(getRouterParam(event, "id") ?? "", 10);

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, data: { message: "Invalid page id" } });
  }

  const body = await readBody(event);
  const {
    title,
    slug,
    content,
    status,
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

  const timestamp = now();

  try {
    const updated = await db.page.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: slug?.trim() || undefined,
        content: content.trim(),
        status,
        excerpt: excerpt?.trim() ?? null,
        coverImage: coverImage?.trim() ?? null,
        seoTitle: seoTitle?.trim() ?? null,
        seoDescription: seoDescription?.trim() ?? null,
        seoKeywords: seoKeywords?.trim() ?? null,
        publishedAt: status === "published" ? toBigInt(publishedAt ?? Number(timestamp)) : toBigInt(publishedAt),
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

    return normalizeBigInt(updated);
  } catch (error) {
    console.error("Failed to update page", error);
    throw createError({
      statusCode: 500,
      data: { message: "Unable to update page" }
    });
  }
});
