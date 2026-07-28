import ButtonLoader from "@/app/utils/common/ButtonLoader";

interface TableProps<T extends { id: string | number }> {
  headers: string[];
  data: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
  selectedRows?: (string | number)[];
  onRowSelect?: (id: string | number) => void;
  onSelectAll?: () => void;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

const Table = <T extends { id: string | number }>({
  headers,
  data,
  renderRow,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  onRowClick,
  isLoading = false,
}: TableProps<T>) => {
  return (
    <div className="scrollbar-hide  rounded-lg border border-gray-100 shadow-sm bg-white dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Header */}
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {onRowSelect && onSelectAll && (
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={
                    selectedRows.length === data.length && data.length > 0
                  }
                  onChange={onSelectAll}
                />
              </th>
            )}
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-100 dark:bg-black dark:divide-gray-700">
          {isLoading ? (
            <tr>
              <td
                colSpan={headers.length + (onRowSelect ? 1 : 0)}
                className="text-center py-6 "
              >
                <ButtonLoader />
              </td>
            </tr>
          ) : (
            data?.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)} // 👈 এখানে add করবে
                className={`transition-colors ${
                  selectedRows.includes(row.id)
                    ? "bg-blue-50 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900"
                } ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {onRowSelect && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => onRowSelect(row.id)}
                    />
                  </td>
                )}
                {renderRow(row, index)}
              </tr>
            ))
          )}
        </tbody>

        {/* Empty State */}
        {data.length === 0 && (
          <tfoot>
            <tr>
              <td
                colSpan={headers.length + (onRowSelect ? 1 : 0)}
                className="text-center py-6 text-gray-500"
              >
                No data available
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      </div>
    </div>
  );
};

export default Table;
