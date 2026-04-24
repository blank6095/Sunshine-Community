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
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { userService } from '../../services/userService';
import { useToast } from '../../components/common/Toast';
import { STATUS_OPTIONS, PAGINATION } from '../../utils/constants';
import { validateTitle } from '../../utils/validators';

const Doctors = () => {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deleteDoctor, setDeleteDoctor] = useState(null);
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [filters, setFilters] = useState({
    departmentId: '',
    status: '',
    search: '',
  });
  const [formData, setFormData] = useState({
    userId: '',
    departmentId: '',
    title: '',
    specialty: '',
    bio: '',
    status: 'ACTIVE',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await doctorService.getDoctors();
      setDoctors(Array.isArray(data) ? data : []);
      setPagination((prev) => ({ ...prev, total: Array.isArray(data) ? data.length : 0 }));
    } catch (err) {
      showToast('获取医生列表失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(Array.isArray(data) ? data.filter((d) => d.status === 'ACTIVE') : []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  }, []);

  const fetchAvailableUsers = useCallback(async () => {
    try {
      const data = await userService.getUsers({ role: 'DOCTOR' });
      const existingDoctorUserIds = doctors.map((d) => d.user?.id);
      const availableUsers = (Array.isArray(data) ? data : []).filter((u) => !existingDoctorUserIds.includes(u.id));
      setUsers(availableUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, [doctors]);

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
    fetchAvailableUsers();
  }, [fetchDoctors, fetchDepartments, fetchAvailableUsers]);

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

  const openAddModal = async () => {
    await fetchAvailableUsers();
    setSelectedDoctor(null);
    setFormData({
      userId: '',
      departmentId: '',
      title: '',
      specialty: '',
      bio: '',
      status: 'ACTIVE',
    });
    setErrors({});
    setModalVisible(true);
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      userId: doctor.user?.id || '',
      departmentId: doctor.department?.id || '',
      title: doctor.title || '',
      specialty: doctor.specialty || '',
      bio: doctor.bio || '',
      status: doctor.status,
    });
    setErrors({});
    setModalVisible(true);
  };

  const handleDelete = (doctor) => {
    setDeleteDoctor(doctor);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await doctorService.deleteDoctor(deleteDoctor.id);
      showToast('删除医生成功', 'success');
      fetchDoctors();
    } catch (err) {
      showToast('删除医生失败', 'error');
    } finally {
      setConfirmVisible(false);
      setDeleteDoctor(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = '请选择用户';
    if (!formData.departmentId) newErrors.departmentId = '请选择科室';
    const titleError = validateTitle(formData.title);
    if (titleError) newErrors.title = titleError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const data = {
        user: { id: formData.userId },
        department: { id: formData.departmentId },
        title: formData.title,
        specialty: formData.specialty || undefined,
        bio: formData.bio || undefined,
        status: formData.status,
      };

      if (!selectedDoctor) {
        await doctorService.createDoctor(data);
        showToast('创建医生成功', 'success');
      } else {
        await doctorService.updateDoctor(selectedDoctor.id, data);
        showToast('更新医生成功', 'success');
      }

      setModalVisible(false);
      fetchDoctors();
    } catch (err) {
      showToast(err.message || '操作失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '姓名', dataIndex: 'user', render: (user) => user?.name || '-' },
    { title: '科室', dataIndex: 'department', render: (dept) => dept?.name || '-' },
    { title: '职称', dataIndex: 'title' },
    { title: '专长', dataIndex: 'specialty', render: (spec) => spec || '-' },
    { title: '状态', dataIndex: 'status', render: (status) => <StatusBadge status={status} /> },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 120,
      render: (_, doctor) => (
        <div className="flex gap-2">
          <Button type="ghost" size="small" onClick={() => openEditModal(doctor)}>
            <Edit size={16} />
          </Button>
          <Button type="danger" size="small" onClick={() => handleDelete(doctor)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const departmentOptions = departments.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.username})`,
  }));

  const filteredDoctors = doctors.filter((doctor) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        doctor.user?.name?.toLowerCase().includes(searchLower) ||
        doctor.specialty?.toLowerCase().includes(searchLower)
      );
    }
    if (filters.departmentId && doctor.department?.id !== filters.departmentId) {
      return false;
    }
    if (filters.status && doctor.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">医生管理</h1>
        <Button type="primary" onClick={openAddModal}>
          <Plus size={16} />
          新增医生
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <Input
            placeholder="搜索姓名、专长..."
            value={filters.search}
            onChange={handleSearch}
            className="w-[300px]"
          />
          <Select
            placeholder="全部科室"
            options={[{ value: '', label: '全部科室' }, ...departmentOptions]}
            value={filters.departmentId}
            onChange={(v) => handleFilterChange('departmentId', v)}
            className="w-[150px]"
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
          dataSource={filteredDoctors}
          loading={loading}
          pagination={{ ...pagination, total: filteredDoctors.length }}
          onPageChange={handlePageChange}
        />
      </Card>

      <Modal
        visible={modalVisible}
        title={selectedDoctor ? '编辑医生' : '新增医生'}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText={saving ? '保存中...' : '保存'}
        okType="primary"
        width={600}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!selectedDoctor && (
            <Select
              label="关联用户"
              placeholder="请选择用户"
              options={userOptions}
              value={formData.userId}
              onChange={(v) => setFormData({ ...formData, userId: v })}
              error={errors.userId}
              required
            />
          )}
          <Select
            label="科室"
            placeholder="请选择科室"
            options={departmentOptions}
            value={formData.departmentId}
            onChange={(v) => setFormData({ ...formData, departmentId: v })}
            error={errors.departmentId}
            required
          />
          <Input
            label="职称"
            placeholder="请输入职称"
            value={formData.title}
            onChange={(v) => setFormData({ ...formData, title: v })}
            error={errors.title}
            required
          />
          <Input
            label="专长"
            placeholder="请输入专长"
            value={formData.specialty}
            onChange={(v) => setFormData({ ...formData, specialty: v })}
          />
          <div className="sm:col-span-2">
            <label className="block mb-2 font-medium text-sm text-gray-900">
              简介
            </label>
            <textarea
              placeholder="请输入医生简介"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm leading-relaxed bg-white transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
            />
          </div>
          <Select
            label="状态"
            placeholder="请选择状态"
            options={STATUS_OPTIONS}
            value={formData.status}
            onChange={(v) => setFormData({ ...formData, status: v })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        visible={confirmVisible}
        title="确认删除"
        message={`确定要删除医生 "${deleteDoctor?.user?.name}" 吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        danger
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmVisible(false);
          setDeleteDoctor(null);
        }}
      />
    </div>
  );
};

export default Doctors;
