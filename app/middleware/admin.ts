export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user, fetch } = useUserSession();

  if (!loggedIn.value) {
    await fetch();
  }

  if (!loggedIn.value) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  const u = user.value as { isAdmin?: boolean; role?: string; id?: number } | null;

  const isAdmin =
    u?.isAdmin === true ||
    u?.role === "admin" ||
    u?.id === 1;

  if (!isAdmin) {
    return navigateTo("/");
  }
});
