export default defineEventHandler(async (_event): Promise<Pages[]> => {
        const DB = useDB()

        const query = DB.select().from(tables.pages).orderBy(tables.pages.updatedAt, 'desc')
        const pagesList = await query.all()

        if (!pagesList || pagesList.length === 0) {
            throw createError({
                statusCode: 404,
                message: `No pages found`,
                fatal: true
            })
        }

        return pagesList
    })