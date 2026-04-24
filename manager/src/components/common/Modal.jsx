import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

const Modal = ({
  visible = false,
  title,
  children,
  onOk,
  onCancel,
  okText = '确定',
  cancelText = '取消',
  okType = 'primary',
  width = 520,
  footer = undefined,
  className = '',
}) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (visible) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [visible]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
    };
    if (visible) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [visible, onCancel]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && onCancel) {
      onCancel();
    }
  };

  if (!visible) return null;

  const content = (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[500]"
    >
      <div
        className={twMerge(
          'bg-white rounded-2xl shadow-2xl w-[90vw] max-h-[85vh] overflow-hidden animate-scale-in',
          className
        )}
        style={{ width: `${width}px`, maxWidth: '90vw' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 m-0">{title}</h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="bg-transparent border-0 p-1 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-150"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {children}
        </div>
        {footer !== null && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            {footer || (
              <>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="py-2 px-4 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-200 transition-colors duration-150"
                  >
                    {cancelText}
                  </button>
                )}
                {onOk && (
                  <button
                    onClick={onOk}
                    className={`py-2 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 text-white ${
                      okType === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {okText}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default Modal;
