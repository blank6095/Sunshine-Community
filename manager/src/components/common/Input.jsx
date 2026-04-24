import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  label,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const borderClass = error
    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
    : focused
    ? 'border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
    : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100';

  const inputClasses = twMerge(
    'w-full text-base leading-relaxed bg-white rounded-lg border-2 transition-all duration-200 ease outline-none box-border',
    isPassword ? 'pl-6 pr-12 py-3' : 'px-6 py-3',
    borderClass,
    disabled && 'bg-gray-100 opacity-60 cursor-not-allowed',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="flex items-center gap-1 mb-2 font-semibold text-sm text-gray-900 whitespace-nowrap">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 p-1 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1 animate-slide-down">
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

export default Input;
