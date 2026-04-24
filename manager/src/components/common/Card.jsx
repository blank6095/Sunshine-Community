import { twMerge } from 'tailwind-merge';

const Card = ({ title, children, actions, className = '' }) => {
  return (
    <div className={twMerge('bg-white rounded-xl shadow-sm overflow-hidden', className)}>
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 m-0">{title}</h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
};

export default Card;
