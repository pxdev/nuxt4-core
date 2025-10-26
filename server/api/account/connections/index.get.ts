import { normalizeBigInt, useDB } from "../../../utils/db";

export default defineEventHandler(async (event): Promise<AccountConnection[]> => {
  const { user } = await requireUserSession(event);
  const DB = useDB();
  // Get user connections
  const connections = await DB.socialConnection.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      provider: true,
      providerId: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return normalizeBigInt(connections);
});
