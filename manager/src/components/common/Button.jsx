import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const BUTTON_SIZES = {
  small: 'px-3 py-2 text-xs rounded-lg',
  medium: 'px-4 py-2.5 text-sm rounded-xl',
  large: 'px-6 py-3 text-base rounded-xl',
};

const BUTTON_TYPES = {
  primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 active:bg-gray-300',
  danger: 'bg-red-500 text-white shadow-sm hover:bg-red-600 active:bg-red-700',
  ghost: 'bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
};

const Button = ({
  children,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const mergedClassName = twMerge(
    'inline-flex items-center justify-center gap-2 border-0 font-semibold cursor-pointer transition-all duration-200 ease outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    BUTTON_SIZES[size],
    BUTTON_TYPES[type],
    (disabled || loading) && 'opacity-60 cursor-not-allowed',
    className
  );

  const handleMouseDown = (e) => {
    if (disabled || loading) return;
    e.currentTarget.style.transform = 'translateY(1px)';
  };

  const handleMouseUp = (e) => {
    if (disabled || loading) return;
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <button
      type="button"
      className={mergedClassName}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
