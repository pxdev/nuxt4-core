export const handleOAuth = async (
    event: H3Event,
    userOptions: { id: string; email: string; name: string },
    provider: string
) => {
    const {id: providerId, email, name} = userOptions || {};
    const DB = useDB();
    const today = Date.now();
    const session = await getUserSession(event);

    const USER_SELECT = {
        id: tables.users.id,
        name: tables.users.name,
        username: tables.users.username,
        email: tables.users.email,
        birthday: tables.users.birthday,
        country: tables.users.country,
        aboutMe: tables.users.aboutMe,
        createdAt: tables.users.createdAt,
        updatedAt: tables.users.updatedAt,
    };

    /** ──────────────────────────────
     *  Helper Queries
     *  ────────────────────────────── */
    const findConnection = async (providerIdArg: string, providerArg: string) =>
        DB.select({
            id: tables.socialConnections.id,
            userId: tables.socialConnections.userId,
        })
            .from(tables.socialConnections)
            .where(
                and(
                    eq(tables.socialConnections.providerId, providerIdArg),
                    eq(tables.socialConnections.provider, providerArg)
                )
            )
            .get();

    const findUserByEmail = async (emailArg: string) =>
        DB.select(USER_SELECT)
            .from(tables.users)
            .where(eq(tables.users.email, emailArg))
            .get();

    const findUserById = async (userId: string) =>
        DB.select(USER_SELECT)
            .from(tables.users)
            .where(eq(tables.users.id, userId))
            .get();

    /** ──────────────────────────────
     *  Main Logic
     *  ────────────────────────────── */
    try {
        // ─────────────── No active session (Login or Register)
        if (!session?.user) {
            if (!userOptions) {
                return sendRedirect(event, "/login?error=signin_auth_error");
            }

            let authUser = null;
            const connection = await findConnection(providerId, provider);

            if (!connection?.userId) {
                authUser = await findUserByEmail(email);

                // Email already used by another user
                if (!connection && authUser && email === authUser.email) {
                    return sendRedirect(event, "/login?error=email_already_registered");
                }

                // Create a new user if not found
                if (!authUser?.id) {
                    const inserted = await DB.insert(tables.users)
                        .values({
                            email,
                            name,
                            createdAt: today,
                            updatedAt: today,
                        })
                        .onConflictDoNothing()
                        .returning()
                        .get();

                    if (!inserted) {
                        return sendRedirect(event, "/login?error=signin_auth_error");
                    }

                    authUser = inserted;

                    const createdConnection = await createConnection(
                        authUser.id,
                        provider,
                        providerId
                    );
                    if (!createdConnection?.provider) {
                        console.info(`${provider} connection failed to save`);
                    }
                }
            }

            // If there was a connection, get the associated user
            if (!authUser && connection?.userId) {
                authUser = await findUserById(String(connection.userId));
            }

            if (!authUser) {
                return sendRedirect(event, "/login?error=signin_auth_error");
            }

            const {secure} = useRuntimeConfig(event);
            const userHash = await hash(String(authUser.id), secure.salt);

            await setUserSession(event, {
                user: {
                    ...authUser,
                    hash: userHash,
                },
            });

            return sendRedirect(event, "/account/callback");
        }

        // ─────────────── Active session (Attach or Validate Connection)
        const connection = await findConnection(providerId, provider);

        // Connection exists but belongs to another user
        if (connection && connection.userId !== session.user.id) {
            return sendRedirect(
                event,
                `/u/${session.user.username}/settings?error=connection_already_exists&provider=${provider}`
            );
        }

        // Create a connection if not found
        if (!connection?.userId) {
            const createdConnection = await createConnection(
                session.user.id,
                provider,
                providerId
            );
            if (!createdConnection?.provider) {
                console.info(`${provider} connection failed to save`);
            }
        }

        const {secure} = useRuntimeConfig(event);
        const userHash = await hash(String(session.user.id), secure.salt);

        await setUserSession(event, {
            user: {
                ...session.user,
                hash: userHash,
            },
        });

        return sendRedirect(event, `/account/callback`);
    } catch (error) {
        console.error(error);
        await clearUserSession(event);
        return sendRedirect(event, "/login?error=signin_auth_error");
    }
};
