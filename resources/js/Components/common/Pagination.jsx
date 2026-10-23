import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  // Calculate pages to show with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // number of pages around current page

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const left = currentPage - delta;
    const right = currentPage + delta;
    let hasLeftEllipsis = false;
    let hasRightEllipsis = false;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      } else if (i < left && !hasLeftEllipsis) {
        pages.push('ellipsis-left');
        hasLeftEllipsis = true;
      } else if (i > right && !hasRightEllipsis) {
        pages.push('ellipsis-right');
        hasRightEllipsis = true;
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav 
      className={`pagination-container ${className}`} 
      aria-label="Pagination des pages"
    >
      <button
        type="button"
        className="pagination-btn pagination-prev"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Page précédente"
      >
        <ChevronLeft size={18} />
        <span className="pagination-text-nav">Précédent</span>
      </button>

      <ul className="pagination-list">
        {pageNumbers.map((page, index) => {
          if (typeof page === 'string' && page.startsWith('ellipsis')) {
            return (
              <li key={`ellipsis-${index}`} className="pagination-item ellipsis" aria-hidden="true">
                <span>…</span>
              </li>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <li key={page} className="pagination-item">
              <button
                type="button"
                className={`pagination-page-btn ${isCurrent ? 'active' : ''}`}
                onClick={() => handlePageClick(page)}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="pagination-btn pagination-next"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Page suivante"
      >
        <span className="pagination-text-nav">Suivant</span>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
