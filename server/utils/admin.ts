export const requireAdminSession = async (event) => {
  const session = await requireUserSession(event);
  const isAdmin =
    session?.user?.isAdmin === true ||
    session?.user?.role === "admin" ||
    session?.user?.id === 1;

  if (!isAdmin) {
    throw createError({ statusCode: 403, message: "Admin access required" });
  }

  return session;
};
