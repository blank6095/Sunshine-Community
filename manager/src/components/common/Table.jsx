import { Loader2 } from 'lucide-react';
import Pagination from './Pagination';

const Table = ({
  columns = [],
  dataSource = [],
  loading = false,
  pagination = null,
  onPageChange,
  emptyText = '暂无数据',
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="mt-3 text-gray-500 text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (dataSource.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
        <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-sm">
          {emptyText}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left font-semibold text-sm text-gray-600 bg-gray-50 border-b border-gray-200"
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((record, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {col.render ? col.render(record[col.dataIndex], record) : record[col.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="px-4 py-4 flex justify-end">
          <Pagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
