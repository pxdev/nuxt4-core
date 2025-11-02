import { normalizeBigInt, useDB } from "../../../../utils/db";
import { requireAdminSession } from "../../../../utils/admin";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);
  const db = useDB();
  const id = Number.parseInt(getRouterParam(event, "id") ?? "", 10);

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, data: { message: "Invalid page id" } });
  }

  const page = await db.page.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      content: true,
      excerpt: true,
      coverImage: true,
      seoTitle: true,
      seoDescription: true,
      seoKeywords: true,
      publishedAt: true,
      updatedAt: true
    }
  });

  if (!page) {
    throw createError({ statusCode: 404, data: { message: "Page not found" } });
  }

  return normalizeBigInt(page);
});
