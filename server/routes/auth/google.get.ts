export default defineOAuthGoogleEventHandler({
  config: {
    scope: ["email", "profile"]
  },

  async onSuccess (event, { user }) {
      console.log("user info from google", user)

    return handleOAuth(event, {
      id: user.sub,
      email: user.email
    }, "google");
  }

});
