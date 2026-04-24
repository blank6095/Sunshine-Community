import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  Building2,
  UserCog,
  Plus,
  CalendarClock,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { appointmentService } from '../../services/appointmentService';
import { departmentService } from '../../services/departmentService';
import { doctorService } from '../../services/doctorService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/helpers';

const STAT_CARDS_CONFIG = [
  { title: '今日预约', icon: CalendarCheck, color: '#2563EB', bgColor: '#DBEAFE' },
  { title: '本周预约', icon: Calendar, color: '#10B981', bgColor: '#D1FAE5' },
  { title: '科室总数', icon: Building2, color: '#F59E0B', bgColor: '#FEF3C7' },
  { title: '医生总数', icon: UserCog, color: '#8B5CF6', bgColor: '#EDE9FE' },
];

const STAT_KEYS = ['todayAppointments', 'weekAppointments', 'departmentCount', 'doctorCount'];

const QUICK_ACTIONS = [
  { label: '新增用户', icon: Plus, path: '/users' },
  { label: '医生管理', icon: UserCog, path: '/doctors' },
  { label: '排班管理', icon: CalendarClock, path: '/schedules' },
  { label: '预约查询', icon: CalendarCheck, path: '/appointments' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    weekAppointments: 0,
    departmentCount: 0,
    doctorCount: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointments, departments, doctors] = await Promise.all([
        appointmentService.getAppointments(),
        departmentService.getDepartments(),
        doctorService.getDoctors(),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const todayCount = (appointments || []).filter((a) => a.schedule?.date === today).length;
      const weekCount = (appointments || []).filter(
        (a) => new Date(a.appointmentTime) >= new Date(weekAgo)
      ).length;

      setStats({
        todayAppointments: todayCount,
        weekAppointments: weekCount,
        departmentCount: departments?.length || 0,
        doctorCount: doctors?.length || 0,
      });

      setRecentAppointments((appointments || []).slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '患者', dataIndex: 'patient', render: (patient) => patient?.name || '-' },
    { title: '医生', dataIndex: 'doctor', render: (doctor) => doctor?.user?.name || '-' },
    { title: '科室', dataIndex: 'doctor', render: (doctor) => doctor?.department?.name || '-' },
    { title: '预约时间', dataIndex: 'appointmentTime', render: (time) => formatDateTime(time) },
    { title: '状态', dataIndex: 'status', render: (status) => <StatusBadge status={status} /> },
  ];

  const statData = STAT_CARDS_CONFIG.map((config, index) => ({
    ...config,
    value: stats[STAT_KEYS[index]],
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          欢迎回来，{user?.name || '管理员'}
        </h1>
        <p className="text-gray-500">这里是系统概览和最近的操作</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statData.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bgColor }}
              >
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <Card title="快捷操作">
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action, index) => (
                <Button
                  key={index}
                  type="ghost"
                  onClick={() => navigate(action.path)}
                  className="justify-start gap-2"
                >
                  <action.icon size={16} />
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="近期预约">
            <Table
              columns={columns}
              dataSource={recentAppointments}
              loading={loading}
              pagination={false}
              emptyText="暂无预约记录"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
