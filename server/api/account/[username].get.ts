import { normalizeBigInt, useDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const DB = useDB();
  const { username } = getRouterParams(event) as { username: string };
  const user = await DB.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive"
      }
    },
    select: {
      id: true,
      name: true,
      username: true,
      country: true,
      aboutMe: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return user ? normalizeBigInt(user) : null;
});
