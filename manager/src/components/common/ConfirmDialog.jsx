import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  visible,
  title = '确认',
  message = '确定要执行此操作吗？',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  danger = false,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      title={title}
      width={400}
      onCancel={onCancel}
      footer={
        <div className="flex justify-end gap-3">
          <Button type="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button type={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="m-0 text-sm text-gray-600 leading-relaxed">{message}</p>
    </Modal>
  );
};

export default ConfirmDialog;
