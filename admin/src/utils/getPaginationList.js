export default function getPaginationList(page, pageCount) {
  if (pageCount <= 3 || page === 1) {
    return [1, pageCount > 1 ? 2 : 0, pageCount > 2 ? 3 : 0].filter(Boolean);
  }

  if (page === pageCount) {
    return [pageCount - 2, pageCount - 1, pageCount].filter(Boolean);
  }

  return [page - 1, page, page + 1 <= pageCount ? page + 1 : 0].filter(Boolean);
}
