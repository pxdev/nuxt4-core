import { normalizeBigInt, now, toBigInt, useDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readBody(event);
  const DB = useDB();
  const timestamp = now();

  const updateData: Record<string, unknown> = { ...body };
  if (Object.prototype.hasOwnProperty.call(body, "birthday")) {
    updateData.birthday = toBigInt(body.birthday);
  }
  if (Object.prototype.hasOwnProperty.call(updateData, "role")) {
    delete updateData.role;
  }

  try {
    await DB.user.update({
      where: { id: user.id },
      data: {
        ...updateData,
        updatedAt: timestamp
      }
    });
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, data: { success: false } });
  }

  const updated = await DB.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      birthday: true,
      country: true,
      aboutMe: true,
      avatar: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!updated) throw createError({ statusCode: 500, data: { success: false } });

  const normalized = normalizeBigInt(updated);
  await setUserSession(event, {
    user: {
      ...user,
      ...normalized,
      isAdmin: normalized.role === "admin"
    }
  });
  return { success: true };
});
