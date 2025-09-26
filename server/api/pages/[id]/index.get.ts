const cacheGroup = "getAnimeInfo";
const cacheName = "id";

export default defineCachedEventHandler(async (event) => {


  const { id } = getRouterParams(event);
  const data = await getAnimeInfo({ id: Number(id) });

  if (!data) {
    throw createError({
      statusCode: 404,
      message: `Anime not found: '${id}'`,
      fatal: true
    });
  }
  const slug = fixSlug(data.title.romaji);
  return { ...data, slug };
}, {
  maxAge: 43200, // 12 cache
   swr: false,
  group: cacheGroup,
  name: cacheName,
  getKey: event => getRouterParams(event).id as string
});
