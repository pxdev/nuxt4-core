export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user, fetch } = useUserSession();

  if (!loggedIn.value) {
    await fetch();
  }

  if (!loggedIn.value) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  const isAdmin =
    user.value?.isAdmin === true ||
    user.value?.role === "admin" ||
    user.value?.id === 1;

  if (!isAdmin) {
    return navigateTo("/");
  }
});
