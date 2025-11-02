import { normalizeBigInt, useDB } from "../../../utils/db";
import { requireAdminSession } from "../../../utils/admin";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);
  const db = useDB();

  const pages = await db.page.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      publishedAt: true
    }
  });

  return normalizeBigInt(pages);
});
