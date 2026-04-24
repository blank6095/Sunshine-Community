import { twMerge } from 'tailwind-merge';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = '请选择',
  error,
  disabled = false,
  label,
  required = false,
  className = '',
  ...props
}) => {
  const borderClass = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-100';

  // Use standard integer padding values (Tailwind v4 compatible)
  const selectClasses = twMerge(
    'w-full text-base leading-relaxed bg-white cursor-pointer',
    'border-2 rounded-lg transition-all duration-200 ease outline-none box-border',
    'pl-6 pr-10 py-3',
    'appearance-none',
    'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")]',
    'bg-no-repeat bg-[right_12px_center] bg-[length:18px]',
    borderClass,
    disabled && 'bg-gray-100 opacity-60 cursor-not-allowed',
    className
  );

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-semibold text-sm text-gray-900 leading-relaxed whitespace-nowrap">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
