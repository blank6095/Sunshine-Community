import { useState, useEffect, useCallback } from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { useToast } from '../../components/common/Toast';
import { APPOINTMENT_STATUS_OPTIONS, PAGINATION } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';

const Appointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    departmentId: '',
    doctorId: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
      setPagination((prev) => ({ ...prev, total: Array.isArray(data) ? data.length : 0 }));
    } catch (err) {
      showToast('获取预约列表失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchDoctors = useCallback(async () => {
    try {
      const data = await doctorService.getDoctors();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchDepartments();
  }, [fetchAppointments, fetchDoctors, fetchDepartments]);

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

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

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailVisible(true);
  };

  const handleConfirm = (appointment) => {
    setSelectedAppointment(appointment);
    setActionType('confirm');
    setConfirmVisible(true);
  };

  const handleComplete = (appointment) => {
    setSelectedAppointment(appointment);
    setActionType('complete');
    setConfirmVisible(true);
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setActionType('cancel');
    setCancelVisible(true);
  };

  const confirmAction = async () => {
    try {
      const statusMap = {
        confirm: 'CONFIRMED',
        complete: 'COMPLETED',
      };
      if (actionType === 'confirm' || actionType === 'complete') {
        await appointmentService.updateAppointment(selectedAppointment.id, {
          status: statusMap[actionType],
        });
        showToast('操作成功', 'success');
      }
      setConfirmVisible(false);
      fetchAppointments();
    } catch (err) {
      showToast('操作失败', 'error');
    }
  };

  const confirmCancel = async () => {
    try {
      await appointmentService.updateAppointment(selectedAppointment.id, {
        status: 'CANCELLED',
      });
      showToast('预约已取消', 'success');
      setCancelVisible(false);
      fetchAppointments();
    } catch (err) {
      showToast('取消失败', 'error');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '患者姓名',
      dataIndex: 'patient',
      render: (patient) => patient?.name || '-',
    },
    {
      title: '患者电话',
      dataIndex: 'patient',
      render: (patient) => patient?.phone || '-',
    },
    {
      title: '医生',
      dataIndex: 'doctor',
      render: (doctor) => doctor?.user?.name || '-',
    },
    {
      title: '科室',
      dataIndex: 'doctor',
      render: (doctor) => doctor?.department?.name || '-',
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      render: (time) => formatDateTime(time),
    },
    {
      title: '症状',
      dataIndex: 'symptoms',
      render: (symptoms) => symptoms || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 180,
      render: (_, appointment) => (
        <div className="flex gap-2">
          <Button type="ghost" size="small" onClick={() => handleViewDetail(appointment)}>
            <Eye size={16} />
          </Button>
          {appointment.status === 'PENDING' && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleConfirm(appointment)}
            >
              <CheckCircle size={16} />
            </Button>
          )}
          {appointment.status === 'CONFIRMED' && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleComplete(appointment)}
              className="bg-success hover:bg-success-dark"
            >
              完成
            </Button>
          )}
          {['PENDING', 'CONFIRMED'].includes(appointment.status) && (
            <Button
              type="danger"
              size="small"
              onClick={() => handleCancel(appointment)}
            >
              <XCircle size={16} />
            </Button>
          )}
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

  const filteredAppointments = appointments.filter((apt) => {
    if (filters.status && apt.status !== filters.status) return false;
    if (filters.departmentId && apt.doctor?.department?.id !== filters.departmentId) return false;
    if (filters.doctorId && apt.doctor?.id !== filters.doctorId) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        apt.patient?.name?.toLowerCase().includes(searchLower) ||
        apt.doctor?.user?.name?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const DetailRow = ({ label, children }) => (
    <div className="flex py-2 border-b border-gray-200">
      <span className="w-[120px] text-gray-500 flex-shrink-0">{label}</span>
      <span>{children}</span>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">预约管理</h1>
      </div>

      <Card>
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <Input
            placeholder="搜索患者姓名、医生姓名..."
            value={filters.search}
            onChange={handleSearch}
            className="w-[250px]"
          />
          <Select
            placeholder="全部状态"
            options={[{ value: '', label: '全部状态' }, ...APPOINTMENT_STATUS_OPTIONS]}
            value={filters.status}
            onChange={(v) => handleFilterChange('status', v)}
            className="w-[150px]"
          />
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
        </div>

        <Table
          columns={columns}
          dataSource={filteredAppointments}
          loading={loading}
          pagination={{
            ...pagination,
            total: filteredAppointments.length,
          }}
          onPageChange={handlePageChange}
        />
      </Card>

      <Modal
        visible={detailVisible}
        title="预约详情"
        onCancel={() => setDetailVisible(false)}
        footer={
          <Button type="secondary" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        }
        width={600}
      >
        {selectedAppointment && (
          <div className="grid gap-4">
            <DetailRow label="预约ID">{selectedAppointment.id}</DetailRow>
            <DetailRow label="患者姓名">{selectedAppointment.patient?.name}</DetailRow>
            <DetailRow label="患者电话">{selectedAppointment.patient?.phone}</DetailRow>
            <DetailRow label="医生">{selectedAppointment.doctor?.user?.name}</DetailRow>
            <DetailRow label="科室">{selectedAppointment.doctor?.department?.name}</DetailRow>
            <DetailRow label="预约时间">{formatDateTime(selectedAppointment.appointmentTime)}</DetailRow>
            <DetailRow label="症状描述">{selectedAppointment.symptoms || '-'}</DetailRow>
            <DetailRow label="状态"><StatusBadge status={selectedAppointment.status} /></DetailRow>
            <DetailRow label="创建时间">{formatDateTime(selectedAppointment.createdAt)}</DetailRow>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        visible={confirmVisible}
        title="确认操作"
        message={
          actionType === 'confirm'
            ? '确定要确认预约吗？'
            : '确定要完成此预约吗？'
        }
        confirmText="确认"
        cancelText="取消"
        onConfirm={confirmAction}
        onCancel={() => setConfirmVisible(false)}
      />

      <Modal
        visible={cancelVisible}
        title="取消预约"
        onCancel={() => setCancelVisible(false)}
        onOk={confirmCancel}
        okText="确认取消"
        okType="danger"
        width={400}
      >
        <div>
            <p className="mb-4">确定要取消此预约吗？此操作不可恢复。</p>
            <div>
              <label className="block mb-2 font-medium text-sm text-gray-900">
                取消原因
              </label>
              <textarea
                placeholder="请输入取消原因"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm leading-relaxed bg-white transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
              />
            </div>
          </div>
      </Modal>
    </div>
  );
};

export default Appointments;
