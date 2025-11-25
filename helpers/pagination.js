module.exports = (Pagination, query, coutnRecords) => {
  if (query.page) {
    Pagination.currentPage = parseInt(query.page);
  }
  Pagination.skip = parseInt(
    (Pagination.currentPage - 1) * Pagination.itemPage
  );

  Pagination.totalPage = Math.ceil(coutnRecords / Pagination.itemPage);

  return Pagination;
};
