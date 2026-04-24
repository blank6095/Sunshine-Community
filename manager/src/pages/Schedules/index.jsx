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
import { scheduleService } from '../../services/scheduleService';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { useToast } from '../../components/common/Toast';
import { SCHEDULE_STATUS_OPTIONS, PAGINATION } from '../../utils/constants';
import { validateMaxPatients, validateTime } from '../../utils/validators';
import { formatDate } from '../../utils/helpers';

const Schedules = () => {
  const { showToast } = useToast();
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deleteSchedule, setDeleteSchedule] = useState(null);
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [filters, setFilters] = useState({
    departmentId: '',
    doctorId: '',
    date: '',
    status: '',
  });
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    startTime: '',
    endTime: '',
    maxPatients: '',
    status: 'ACTIVE',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await scheduleService.getSchedules();
      setSchedules(Array.isArray(data) ? data : []);
      setPagination((prev) => ({ ...prev, total: Array.isArray(data) ? data.length : 0 }));
    } catch (err) {
      showToast('获取排班列表失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchDoctors = useCallback(async () => {
    try {
      const data = await doctorService.getDoctors();
      setDoctors(Array.isArray(data) ? data.filter((d) => d.status === 'ACTIVE') : []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(Array.isArray(data) ? data.filter((d) => d.status === 'ACTIVE') : []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    fetchDoctors();
    fetchDepartments();
  }, [fetchSchedules, fetchDoctors, fetchDepartments]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'departmentId') {
      setFilters((prev) => ({ ...prev, doctorId: '' }));
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const openAddModal = () => {
    setSelectedSchedule(null);
    setFormData({
      doctorId: '',
      date: '',
      startTime: '',
      endTime: '',
      maxPatients: '',
      status: 'ACTIVE',
    });
    setErrors({});
    setModalVisible(true);
  };

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      doctorId: schedule.doctor?.id || '',
      date: schedule.date || '',
      startTime: schedule.startTime || '',
      endTime: schedule.endTime || '',
      maxPatients: schedule.maxPatients || '',
      status: schedule.status,
    });
    setErrors({});
    setModalVisible(true);
  };

  const handleDelete = (schedule) => {
    setDeleteSchedule(schedule);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await scheduleService.deleteSchedule(deleteSchedule.id);
      showToast('删除排班成功', 'success');
      fetchSchedules();
    } catch (err) {
      showToast('删除排班失败', 'error');
    } finally {
      setConfirmVisible(false);
      setDeleteSchedule(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctorId) newErrors.doctorId = '请选择医生';
    if (!formData.date) newErrors.date = '请选择日期';
    if (!formData.startTime) newErrors.startTime = '请选择开始时间';
    if (!formData.endTime) newErrors.endTime = '请选择结束时间';
    const timeError = validateTime(formData.startTime, formData.endTime);
    if (timeError) newErrors.endTime = timeError;
    const maxPatientsError = validateMaxPatients(formData.maxPatients);
    if (maxPatientsError) newErrors.maxPatients = maxPatientsError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const data = {
        doctor: { id: formData.doctorId },
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxPatients: parseInt(formData.maxPatients, 10),
        status: formData.status,
      };

      if (!selectedSchedule) {
        await scheduleService.createSchedule(data);
        showToast('创建排班成功', 'success');
      } else {
        await scheduleService.updateSchedule(selectedSchedule.id, data);
        showToast('更新排班成功', 'success');
      }

      setModalVisible(false);
      fetchSchedules();
    } catch (err) {
      showToast(err.message || '操作失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '医生', dataIndex: 'doctor', render: (doctor) => doctor?.user?.name || '-' },
    { title: '科室', dataIndex: 'doctor', render: (doctor) => doctor?.department?.name || '-' },
    { title: '日期', dataIndex: 'date', render: (date) => formatDate(date) },
    { title: '时间段', dataIndex: 'time', render: (_, record) => `${record.startTime} - ${record.endTime}` },
    { title: '最大人数', dataIndex: 'maxPatients' },
    { title: '可预约', dataIndex: 'availableSlots' },
    { title: '状态', dataIndex: 'status', render: (status) => <StatusBadge status={status} /> },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 120,
      render: (_, schedule) => (
        <div className="flex gap-2">
          <Button type="ghost" size="small" onClick={() => openEditModal(schedule)}>
            <Edit size={16} />
          </Button>
          <Button type="danger" size="small" onClick={() => handleDelete(schedule)}>
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

  const filteredDoctorsByDepartment = filters.departmentId
    ? doctors.filter((d) => d.department?.id === filters.departmentId)
    : doctors;

  const doctorOptions = filteredDoctorsByDepartment.map((d) => ({
    value: d.id,
    label: d.user?.name || `医生${d.id}`,
  }));

  const filteredSchedules = schedules.filter((schedule) => {
    if (filters.departmentId && schedule.doctor?.department?.id !== filters.departmentId) {
      return false;
    }
    if (filters.doctorId && schedule.doctor?.id !== filters.doctorId) {
      return false;
    }
    if (filters.date && schedule.date !== filters.date) {
      return false;
    }
    if (filters.status && schedule.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">排班管理</h1>
        <Button type="primary" onClick={openAddModal}>
          <Plus size={16} />
          新增排班
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <Select
            placeholder="全部科室"
            options={[{ value: '', label: '全部科室' }, ...departmentOptions]}
            value={filters.departmentId}
            onChange={(v) => handleFilterChange('departmentId', v)}
            className="w-[150px]"
          />
          <Select
            placeholder="全部医生"
            options={[{ value: '', label: '全部医生' }, ...doctorOptions]}
            value={filters.doctorId}
            onChange={(v) => handleFilterChange('doctorId', v)}
            className="w-[150px]"
          />
          <Input
            type="date"
            placeholder="选择日期"
            value={filters.date}
            onChange={(v) => handleFilterChange('date', v)}
            className="w-[150px]"
          />
          <Select
            placeholder="全部状态"
            options={SCHEDULE_STATUS_OPTIONS}
            value={filters.status}
            onChange={(v) => handleFilterChange('status', v)}
            className="w-[150px]"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredSchedules}
          loading={loading}
          pagination={{ ...pagination, total: filteredSchedules.length }}
          onPageChange={handlePageChange}
        />
      </Card>

      <Modal
        visible={modalVisible}
        title={selectedSchedule ? '编辑排班' : '新增排班'}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText={saving ? '保存中...' : '保存'}
        okType="primary"
        width={500}
      >
        <div>
          <div className="mb-4">
            <Select
              label="科室"
              placeholder="请先选择科室"
              options={[{ value: '', label: '请选择科室' }, ...departmentOptions]}
              value={filters.departmentId}
              onChange={(v) => {
                setFilters((prev) => ({ ...prev, departmentId: v, doctorId: '' }));
              }}
            />
          </div>
          <div className="mb-4">
            <Select
              label="医生"
              placeholder="请选择医生"
              options={doctorOptions}
              value={formData.doctorId}
              onChange={(v) => setFormData({ ...formData, doctorId: v })}
              error={errors.doctorId}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="date"
              label="日期"
              placeholder="请选择日期"
              value={formData.date}
              onChange={(v) => setFormData({ ...formData, date: v })}
              error={errors.date}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              type="time"
              label="开始时间"
              placeholder="选择开始时间"
              value={formData.startTime}
              onChange={(v) => setFormData({ ...formData, startTime: v })}
              error={errors.startTime}
              required
            />
            <Input
              type="time"
              label="结束时间"
              placeholder="选择结束时间"
              value={formData.endTime}
              onChange={(v) => setFormData({ ...formData, endTime: v })}
              error={errors.endTime}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              label="最大预约人数"
              placeholder="请输入最大预约人数"
              value={formData.maxPatients}
              onChange={(v) => setFormData({ ...formData, maxPatients: v })}
              error={errors.maxPatients}
              required
            />
          </div>
          <Select
            label="状态"
            placeholder="请选择状态"
            options={SCHEDULE_STATUS_OPTIONS}
            value={formData.status}
            onChange={(v) => setFormData({ ...formData, status: v })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        visible={confirmVisible}
        title="确认删除"
        message="确定要删除此排班吗？此操作不可恢复。"
        confirmText="删除"
        cancelText="取消"
        danger
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmVisible(false);
          setDeleteSchedule(null);
        }}
      />
    </div>
  );
};

export default Schedules;
