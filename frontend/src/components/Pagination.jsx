export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const pages = Array.from(
    { length: pagination.totalPages },
    (_, index) => index + 1,
  );
  return (
    <nav className="pagination" aria-label="Course pages">
      <button
        disabled={pagination.currentPage === 1}
        onClick={() => onPageChange(pagination.currentPage - 1)}
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={page === pagination.currentPage ? "current" : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        disabled={pagination.currentPage === pagination.totalPages}
        onClick={() => onPageChange(pagination.currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
}
