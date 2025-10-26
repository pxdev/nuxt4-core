import { normalizeBigInt, useDB } from "../../utils/db";

export default defineEventHandler(async (_event): Promise<Pages[]> => {
        const DB = useDB()

        const pagesList = await DB.page.findMany({
            orderBy: { updatedAt: "desc" }
        })

        if (!pagesList || pagesList.length === 0) {
            throw createError({
                statusCode: 404,
                message: `No pages found`,
                fatal: true
            })
        }

        return normalizeBigInt(pagesList)
    })
