import base64 from 'base-64';

export const paginator = async (query, page, uniqueColumn) => {
  query.orderBy(uniqueColumn, 'ASC');

  // if cursor then base64 decode
  if (page.cursor) {
    const decodedCursor = base64.decode(page.cursor);
    query.where(uniqueColumn, '>=', decodedCursor);
  }

  // then apply limit + 1
  query.limit(page.limit + 1);

  // fetch items
  let items = await query;

  let encodedCursor;
  if (items.length > page.limit) {
    // we have a next page - make a cursor
    encodedCursor = base64.encode(items[page.limit][uniqueColumn]);
    items = items.slice(0, page.limit);
  }

  return {
    items,
    response_metadata: {
      next_cursor: encodedCursor,
    },
  };
};
