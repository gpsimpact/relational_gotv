import base64 from 'base-64';

export const paginator = async (query, page) => {
  // determine which field to sort by and direction
  let direction = 'ASC';
  let sortVar;
  if (page.order.endsWith('_ASC')) {
    direction = 'ASC';
    sortVar = page.order.replace('_ASC', '');
  } else if (page.order.endsWith('_DESC')) {
    direction = 'DESC';
    sortVar = page.order.replace('_DESC', '');
  }

  // order by field and determined direction
  query.orderBy(sortVar, direction);

  // then if cursor then base64 decode
  if (page.cursor) {
    const decodedCursor = base64.decode(page.cursor);
    if (direction === 'ASC') {
      query.where(sortVar, '>=', decodedCursor);
    } else if (direction === 'ASC') {
      query.where(sortVar, '<=', decodedCursor);
    }
  }

  // then apply limit + 1
  query.limit(page.limit + 1);

  // fetch items
  let items = await query;

  let encodedCursor;
  if (items.length > page.limit) {
    // we have a next page - make a cursor
    encodedCursor = base64.encode(items[page.limit][sortVar]);
    items = items.slice(0, page.limit);
  }

  return {
    items,
    response_metadata: {
      next_cursor: encodedCursor,
    },
  };
};
