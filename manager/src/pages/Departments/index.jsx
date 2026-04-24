import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import { departmentService } from '../../services/departmentService';
import { useToast } from '../../components/common/Toast';
import { STATUS_OPTIONS, PAGINATION } from '../../utils/constants';
import { validateDepartmentName } from '../../utils/validators';
import { formatDate } from '../../utils/helpers';

const Departments = () => {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteDepartment, setDeleteDepartment] = useState(null);
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
      setPagination((prev) => ({ ...prev, total: Array.isArray(data) ? data.length : 0 }));
    } catch (err) {
      showToast('获取科室列表失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const openAddModal = () => {
    setSelectedDepartment(null);
    setFormData({ name: '', description: '', status: 'ACTIVE' });
    setErrors({});
    setModalVisible(true);
  };

  const openEditModal = (department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
      status: department.status,
    });
    setErrors({});
    setModalVisible(true);
  };

  const handleDelete = (department) => {
    setDeleteDepartment(department);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await departmentService.deleteDepartment(deleteDepartment.id);
      showToast('删除科室成功', 'success');
      fetchDepartments();
    } catch (err) {
      showToast('删除科室失败', 'error');
    } finally {
      setConfirmVisible(false);
      setDeleteDepartment(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const nameError = validateDepartmentName(formData.name);
    if (nameError) newErrors.name = nameError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const data = {
        name: formData.name,
        description: formData.description || undefined,
        status: formData.status,
      };

      if (!selectedDepartment) {
        await departmentService.createDepartment(data);
        showToast('创建科室成功', 'success');
      } else {
        await departmentService.updateDepartment(selectedDepartment.id, data);
        showToast('更新科室成功', 'success');
      }

      setModalVisible(false);
      fetchDepartments();
    } catch (err) {
      showToast(err.message || '操作失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '科室名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'description', render: (desc) => desc || '-' },
    { title: '状态', dataIndex: 'status', render: (status) => <StatusBadge status={status} /> },
    { title: '创建时间', dataIndex: 'createdAt', render: (date) => formatDate(date) },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 120,
      render: (_, dept) => (
        <div className="flex gap-2">
          <Button type="ghost" size="small" onClick={() => openEditModal(dept)}>
            <Edit size={16} />
          </Button>
          <Button type="danger" size="small" onClick={() => handleDelete(dept)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const filteredDepartments = departments.filter((dept) => {
    if (filters.search) {
      return dept.name.toLowerCase().includes(filters.search.toLowerCase());
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">科室管理</h1>
        <Button type="primary" onClick={openAddModal}>
          <Plus size={16} />
          新增科室
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <Input
            placeholder="搜索科室名称..."
            value={filters.search}
            onChange={handleSearch}
            className="w-[300px]"
          />
          <Select
            placeholder="全部状态"
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(v) => handleFilterChange('status', v)}
            className="w-[150px]"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredDepartments}
          loading={loading}
          pagination={{ ...pagination, total: filteredDepartments.length }}
          onPageChange={handlePageChange}
        />
      </Card>

      <Modal
        visible={modalVisible}
        title={selectedDepartment ? '编辑科室' : '新增科室'}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText={saving ? '保存中...' : '保存'}
        okType="primary"
        width={500}
      >
        <div>
          <Input
            label="科室名称"
            placeholder="请输入科室名称"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            error={errors.name}
            required
          />
          <div className="mt-4">
            <label className="block mb-2 font-medium text-sm text-gray-900">
              描述
            </label>
            <textarea
              placeholder="请输入科室描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm leading-relaxed bg-white transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
            />
          </div>
          <div className="mt-4">
            <Select
              label="状态"
              placeholder="请选择状态"
              options={STATUS_OPTIONS}
              value={formData.status}
              onChange={(v) => setFormData({ ...formData, status: v })}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        visible={confirmVisible}
        title="确认删除"
        message={`确定要删除科室 "${deleteDepartment?.name}" 吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        danger
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmVisible(false);
          setDeleteDepartment(null);
        }}
      />
    </div>
  );
};

export default Departments;
