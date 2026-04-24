import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  current = 1,
  pageSize = 10,
  total = 0,
  onChange,
  style = {},
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const handlePrev = () => {
    if (current > 1 && onChange) {
      onChange(current - 1);
    }
  };

  const handleNext = () => {
    if (current < totalPages && onChange) {
      onChange(current + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && onChange && page !== current) {
      onChange(page);
    }
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    height: '36px',
    padding: '0 8px',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    color: 'white',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', ...style }}>
      <span style={{ fontSize: '14px', color: '#64748B' }}>
        共 {total} 条
      </span>
      <button
        onClick={handlePrev}
        disabled={current === 1}
        style={{
          ...buttonStyle,
          opacity: current === 1 ? 0.5 : 1,
          cursor: current === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronLeft size={16} />
      </button>
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          style={page === current ? activeButtonStyle : buttonStyle}
        >
          {page}
        </button>
      ))}
      <button
        onClick={handleNext}
        disabled={current === totalPages}
        style={{
          ...buttonStyle,
          opacity: current === totalPages ? 0.5 : 1,
          cursor: current === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
