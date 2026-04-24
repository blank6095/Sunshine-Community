import { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, Users, Building2, UserCog } from 'lucide-react';
import Card from '../../components/common/Card';
import { appointmentService } from '../../services/appointmentService';
import { departmentService } from '../../services/departmentService';
import { doctorService } from '../../services/doctorService';
import { userService } from '../../services/userService';
import { APPOINTMENT_STATUS } from '../../utils/constants';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalDepartments: 0,
    totalDoctors: 0,
    statusDistribution: {},
    departmentDistribution: [],
    doctorWorkload: [],
    recentTrend: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    try {
      const [appointments, departments, doctors, users] = await Promise.all([
        appointmentService.getAppointments(),
        departmentService.getDepartments(),
        doctorService.getDoctors(),
        userService.getUsers(),
      ]);

      const aptList = Array.isArray(appointments) ? appointments : [];
      const deptList = Array.isArray(departments) ? departments : [];
      const doctorList = Array.isArray(doctors) ? doctors : [];
      const userList = Array.isArray(users) ? users : [];

      const statusDistribution = {
        PENDING: aptList.filter((a) => a.status === APPOINTMENT_STATUS.PENDING).length,
        CONFIRMED: aptList.filter((a) => a.status === APPOINTMENT_STATUS.CONFIRMED).length,
        COMPLETED: aptList.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED).length,
        CANCELLED: aptList.filter((a) => a.status === APPOINTMENT_STATUS.CANCELLED).length,
      };

      const departmentMap = {};
      deptList.forEach((dept) => {
        departmentMap[dept.id] = { name: dept.name, count: 0 };
      });
      aptList.forEach((apt) => {
        const deptId = apt.doctor?.department?.id;
        if (deptId && departmentMap[deptId]) {
          departmentMap[deptId].count++;
        }
      });
      const departmentDistribution = Object.values(departmentMap).sort((a, b) => b.count - a.count);

      const doctorMap = {};
      doctorList.forEach((doc) => {
        const name = doc.user?.name || `医生${doc.id}`;
        doctorMap[doc.id] = { name, count: 0 };
      });
      aptList.forEach((apt) => {
        const doctorId = apt.doctor?.id;
        if (doctorId && doctorMap[doctorId]) {
          doctorMap[doctorId].count++;
        }
      });
      const doctorWorkload = Object.values(doctorMap).sort((a, b) => b.count - a.count).slice(0, 10);

      const patients = userList.filter((u) => u.role === 'PATIENT');

      setStats({
        totalAppointments: aptList.length,
        totalPatients: patients.length,
        totalDepartments: deptList.length,
        totalDoctors: doctorList.length,
        statusDistribution,
        departmentDistribution,
        doctorWorkload,
        recentTrend: [],
      });
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const statCards = [
    { title: '预约总数', value: stats.totalAppointments, icon: CalendarCheck, color: '#2563EB', bgColor: '#DBEAFE' },
    { title: '患者总数', value: stats.totalPatients, icon: Users, color: '#10B981', bgColor: '#D1FAE5' },
    { title: '科室总数', value: stats.totalDepartments, icon: Building2, color: '#F59E0B', bgColor: '#FEF3C7' },
    { title: '医生总数', value: stats.totalDoctors, icon: UserCog, color: '#8B5CF6', bgColor: '#EDE9FE' },
  ];

  const getStatusColor = (status) => {
    const colors = { PENDING: '#F59E0B', CONFIRMED: '#2563EB', COMPLETED: '#10B981', CANCELLED: '#EF4444' };
    return colors[status] || '#64748B';
  };

  const getStatusName = (status) => {
    const names = { PENDING: '待确认', CONFIRMED: '已确认', COMPLETED: '已完成', CANCELLED: '已取消' };
    return names[status] || status;
  };

  const ProgressBar = ({ percentage, color, height = 'h-2' }) => (
    <div className={`${height} bg-gray-200 rounded overflow-hidden`}>
      <div
        className={`${height} rounded transition-all duration-300 ease`}
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );

  const LoadingPlaceholder = () => (
    <div className="h-[200px] flex items-center justify-center text-gray-500">加载中...</div>
  );

  const EmptyPlaceholder = () => (
    <div className="h-[200px] flex items-center justify-center text-gray-500">暂无数据</div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">统计报表</h1>
        <p className="text-gray-500">系统数据概览和统计信息</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bgColor }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="预约状态分布">
          {loading ? (
            <LoadingPlaceholder />
          ) : (
            <div className="flex flex-col gap-4">
              {Object.entries(stats.statusDistribution).map(([status, count]) => {
                const percentage = stats.totalAppointments > 0
                  ? ((count / stats.totalAppointments) * 100).toFixed(1)
                  : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-gray-600">{getStatusName(status)}</span>
                      <span className="text-sm font-semibold text-gray-900">{count} ({percentage}%)</span>
                    </div>
                    <ProgressBar percentage={percentage} color={getStatusColor(status)} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="科室预约分布">
          {loading ? (
            <LoadingPlaceholder />
          ) : stats.departmentDistribution.length === 0 ? (
            <EmptyPlaceholder />
          ) : (
            <div className="flex flex-col gap-3">
              {stats.departmentDistribution.slice(0, 6).map((dept, index) => {
                const maxDeptCount = stats.departmentDistribution[0]?.count || 1;
                const percentage = (dept.count / maxDeptCount) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">{dept.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{dept.count}</span>
                    </div>
                    <ProgressBar percentage={percentage} color="#2563EB" height="h-1.5" />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="医生工作量排名" className="lg:col-span-2">
          {loading ? (
            <LoadingPlaceholder />
          ) : stats.doctorWorkload.length === 0 ? (
            <EmptyPlaceholder />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {stats.doctorWorkload.map((doctor, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: index < 3 ? '#DBEAFE' : '#F1F5F9',
                      color: index < 3 ? '#1E40AF' : '#64748B',
                    }}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{doctor.name}</p>
                  <p className="text-2xl font-bold text-primary">{doctor.count}</p>
                  <p className="text-xs text-gray-500">预约数</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
