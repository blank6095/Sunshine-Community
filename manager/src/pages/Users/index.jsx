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
import { userService } from '../../services/userService';
import { useToast } from '../../components/common/Toast';
import {
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  PAGINATION,
  GENDER_OPTIONS,
} from '../../utils/constants';
import {
  validateUsername,
  validatePassword,
  validateName,
  validatePhone,
  validateEmail,
} from '../../utils/validators';

const Users = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    gender: '',
    age: '',
    phone: '',
    email: '',
    idCard: '',
    role: '',
    status: 'ACTIVE',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setPagination((prev) => ({ ...prev, total: Array.isArray(data) ? data.length : 0 }));
    } catch (err) {
      showToast('获取用户列表失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
    setSelectedUser(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      gender: '',
      age: '',
      phone: '',
      email: '',
      idCard: '',
      role: '',
      status: 'ACTIVE',
    });
    setErrors({});
    setModalVisible(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      name: user.name,
      gender: user.gender,
      age: user.age,
      phone: user.phone,
      email: user.email || '',
      idCard: user.idCard || '',
      role: user.role,
      status: user.status,
    });
    setErrors({});
    setModalVisible(true);
  };

  const handleDelete = (user) => {
    setDeleteUser(user);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await userService.deleteUser(deleteUser.id);
      showToast('删除用户成功', 'success');
      fetchUsers();
    } catch (err) {
      showToast('删除用户失败', 'error');
    } finally {
      setConfirmVisible(false);
      setDeleteUser(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedUser) {
      const usernameError = validateUsername(formData.username);
      if (usernameError) newErrors.username = usernameError;

      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    if (!formData.gender) newErrors.gender = '请选择性别';
    if (!formData.age) newErrors.age = '年龄不能为空';

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    if (formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (!selectedUser && !formData.role) newErrors.role = '请选择角色';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const data = {
        name: formData.name,
        gender: formData.gender,
        age: parseInt(formData.age, 10),
        phone: formData.phone,
        email: formData.email || undefined,
        idCard: formData.idCard || undefined,
        status: formData.status,
      };

      if (!selectedUser) {
        data.username = formData.username;
        data.password = formData.password;
        data.role = formData.role;
        await userService.createUser(data);
        showToast('创建用户成功', 'success');
      } else {
        await userService.updateUser(selectedUser.id, data);
        showToast('更新用户成功', 'success');
      }

      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      showToast(error.message || '操作失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username' },
    { title: '姓名', dataIndex: 'name' },
    { title: '性别', dataIndex: 'gender' },
    { title: '年龄', dataIndex: 'age' },
    { title: '手机', dataIndex: 'phone' },
    { title: '角色', dataIndex: 'role', render: (role) => <StatusBadge status={role} /> },
    { title: '状态', dataIndex: 'status', render: (status) => <StatusBadge status={status} /> },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 120,
      render: (_, user) => (
        <div className="flex gap-2">
          <Button type="ghost" size="small" onClick={() => openEditModal(user)}>
            <Edit size={16} />
          </Button>
          <Button type="danger" size="small" onClick={() => handleDelete(user)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const filteredUsers = users.filter((user) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        user.username.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower) ||
        user.phone.includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">用户管理</h1>
        <Button type="primary" onClick={openAddModal}>
          <Plus size={16} />
          新增用户
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <Input
            placeholder="搜索用户名、姓名、手机号..."
            value={filters.search}
            onChange={handleSearch}
            className="w-[300px]"
          />
          <Select
            placeholder="全部角色"
            options={ROLE_OPTIONS}
            value={filters.role}
            onChange={(v) => handleFilterChange('role', v)}
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
          dataSource={filteredUsers}
          loading={loading}
          pagination={{ ...pagination, total: filteredUsers.length }}
          onPageChange={handlePageChange}
        />
      </Card>

      <Modal
        visible={modalVisible}
        title={selectedUser ? '编辑用户' : '新增用户'}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText={saving ? '保存中...' : '保存'}
        okType="primary"
        width={600}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!selectedUser && (
            <>
              <Input
                label="用户名"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={(v) => setFormData({ ...formData, username: v })}
                error={errors.username}
                required
              />
              <Input
                type="password"
                label="密码"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v })}
                error={errors.password}
                required
              />
            </>
          )}
          <Input
            label="姓名"
            placeholder="请输入姓名"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            error={errors.name}
            required
          />
          <Select
            label="性别"
            placeholder="请选择性别"
            options={GENDER_OPTIONS}
            value={formData.gender}
            onChange={(v) => setFormData({ ...formData, gender: v })}
            error={errors.gender}
            required
          />
          <Input
            type="number"
            label="年龄"
            placeholder="请输入年龄"
            value={formData.age}
            onChange={(v) => setFormData({ ...formData, age: v })}
            error={errors.age}
            required
          />
          <Input
            label="手机号"
            placeholder="请输入手机号"
            value={formData.phone}
            onChange={(v) => setFormData({ ...formData, phone: v })}
            error={errors.phone}
            required
          />
          <Input
            label="邮箱"
            placeholder="请输入邮箱"
            value={formData.email}
            onChange={(v) => setFormData({ ...formData, email: v })}
            error={errors.email}
          />
          <Input
            label="身份证号"
            placeholder="请输入身份证号"
            value={formData.idCard}
            onChange={(v) => setFormData({ ...formData, idCard: v })}
          />
          {!selectedUser && (
            <Select
              label="角色"
              placeholder="请选择角色"
              options={ROLE_OPTIONS}
              value={formData.role}
              onChange={(v) => setFormData({ ...formData, role: v })}
              error={errors.role}
              required
            />
          )}
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
        message={`确定要删除用户 "${deleteUser?.name}" 吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        danger
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmVisible(false);
          setDeleteUser(null);
        }}
      />
    </div>
  );
};

export default Users;
