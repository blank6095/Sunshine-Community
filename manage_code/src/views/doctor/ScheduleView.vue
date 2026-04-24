<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getSchedulesByDoctor, createSchedule, updateSchedule, deleteSchedule } from '@/api'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Calendar, Warning } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { FormInstance } from 'element-plus'
import type { Schedule } from '@/types'
import PaginationBar from '@/components/PaginationBar.vue'

const userStore = useUserStore()
const loading = ref(false)
const schedules = ref<Schedule[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加排班')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const viewMode = ref<'table' | 'calendar'>('table')
const currentDate = ref(dayjs().format('YYYY-MM'))

const form = ref({
  id: null as number | null,
  date: '',
  startTime: '',
  endTime: '',
  maxPatients: 20,
  status: 'ACTIVE',
})

const rules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  maxPatients: [{ required: true, message: '请输入最大预约人数', trigger: 'blur' }],
}

const currentMonthSchedules = computed(() => {
  return schedules.value.filter((s) => s.date.startsWith(currentDate.value))
})

const weeklyStats = computed(() => {
  const today = dayjs()
  const weekStart = today.startOf('week')
  const weekEnd = today.endOf('week')

  const weekSchedules = schedules.value.filter((s) => {
    const d = dayjs(s.date)
    return d.isAfter(weekStart) && d.isBefore(weekEnd) && s.status === 'ACTIVE'
  })

  const totalHours = weekSchedules.reduce((sum, s) => {
    const start = dayjs(s.startTime, 'HH:mm')
    const end = dayjs(s.endTime, 'HH:mm')
    return sum + end.diff(start, 'hour')
  }, 0)

  return {
    count: weekSchedules.length,
    hours: totalHours,
    totalSlots: weekSchedules.reduce((sum, s) => sum + s.maxPatients, 0),
    bookedSlots: weekSchedules.reduce((sum, s) => sum + (s.maxPatients - s.availableSlots), 0),
  }
})

const calendarDays = computed(() => {
  const start = dayjs(currentDate.value).startOf('month')
  const days = []

  for (let i = 0; i < start.day(); i++) {
    days.push({ date: null, schedules: [], isCurrentMonth: false })
  }

  const daysInMonth = start.daysInMonth()
  for (let i = 1; i <= daysInMonth; i++) {
    const date = start.date(i).format('YYYY-MM-DD')
    const daySchedules = schedules.value.filter((s) => s.date === date)
    days.push({ date, schedules: daySchedules, isCurrentMonth: true })
  }

  while (days.length % 7 !== 0) {
    days.push({ date: null, schedules: [], isCurrentMonth: false })
  }

  return days
})

const loadSchedules = async () => {
  loading.value = true
  try {
    if (userStore.user) {
      const res = await getSchedulesByDoctor(userStore.user.id)
      schedules.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载排班失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加排班'
  form.value = { id: null, date: '', startTime: '', endTime: '', maxPatients: 20, status: 'ACTIVE' }
  dialogVisible.value = true
}

const handleEdit = (row: Schedule) => {
  isEdit.value = true
  dialogTitle.value = '编辑排班'
  form.value = {
    id: row.id,
    date: row.date,
    startTime: row.startTime,
    endTime: row.endTime,
    maxPatients: row.maxPatients,
    status: row.status,
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value && form.value.id) {
          await updateSchedule(form.value.id, {
            startTime: form.value.startTime,
            endTime: form.value.endTime,
            maxPatients: form.value.maxPatients,
            status: form.value.status as 'ACTIVE' | 'CANCELLED',
          })
          ElMessage.success('更新成功')
        } else {
          if (userStore.user) {
            await createSchedule({
              doctor: { id: userStore.user.id },
              date: form.value.date,
              startTime: form.value.startTime,
              endTime: form.value.endTime,
              maxPatients: form.value.maxPatients,
            })
            ElMessage.success('添加成功')
          }
        }
        dialogVisible.value = false
        loadSchedules()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDelete = async (row: Schedule) => {
  try {
    await ElMessageBox.confirm('确定要删除该排班吗？', '提示', { type: 'warning' })
    await deleteSchedule(row.id)
    ElMessage.success('删除成功')
    loadSchedules()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const prevMonth = () => {
  currentDate.value = dayjs(currentDate.value).subtract(1, 'month').format('YYYY-MM')
}

const nextMonth = () => {
  currentDate.value = dayjs(currentDate.value).add(1, 'month').format('YYYY-MM')
}

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedSchedules = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return schedules.value.slice(start, end)
})

const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getStatusType = (status: string) => {
  return status === 'ACTIVE' ? 'success' : 'danger'
}

const getStatusText = (status: string) => {
  return status === 'ACTIVE' ? '正常' : '已取消'
}

onMounted(() => {
  loadSchedules()
})
</script>

<template>
  <div class="schedule-view">
    <div class="page-header">
      <h2 class="page-title">日程管理</h2>
      <div class="header-actions">
        <el-button-group>
          <el-button :type="viewMode === 'table' ? 'primary' : ''" @click="viewMode = 'table'">列表</el-button>
          <el-button :type="viewMode === 'calendar' ? 'primary' : ''" @click="viewMode = 'calendar'">日历</el-button>
        </el-button-group>
        <el-button type="primary" @click="handleAdd" :icon="Plus">添加排班</el-button>
      </div>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ weeklyStats.count }}</div>
          <div class="stat-label">本周排班</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ weeklyStats.hours }}h</div>
          <div class="stat-label">本周工时</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ weeklyStats.totalSlots }}</div>
          <div class="stat-label">总号源</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ weeklyStats.bookedSlots }}</div>
          <div class="stat-label">已预约</div>
        </el-card>
      </el-col>
    </el-row>

    <div v-if="viewMode === 'table'">
      <el-table v-loading="loading" :data="paginatedSchedules" style="width: 100%; margin-top: 16px" stripe>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="100" />
        <el-table-column prop="endTime" label="结束时间" width="100" />
        <el-table-column prop="maxPatients" label="最大预约人数" width="120" />
        <el-table-column prop="availableSlots" label="剩余名额" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button size="small" link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <PaginationBar
        v-if="schedules.length > 0"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="schedules.length"
        @change="handlePageChange"
      />
    </div>

    <div v-else class="calendar-view">
      <div class="calendar-header">
        <el-button @click="prevMonth">&lt;</el-button>
        <span class="calendar-title">{{ currentDate }}</span>
        <el-button @click="nextMonth">&gt;</el-button>
      </div>

      <div class="calendar-grid">
        <div class="calendar-weekday" v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">
          {{ day }}
        </div>
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="calendar-day"
          :class="{ 'is-current-month': day.isCurrentMonth, 'is-today': day.date === dayjs().format('YYYY-MM-DD') }"
        >
          <div v-if="day.date" class="day-content">
            <div class="day-date">{{ day.date.split('-')[2] }}</div>
            <div v-for="schedule in day.schedules" :key="schedule.id" class="schedule-tag">
              <el-tag size="small" :type="getStatusType(schedule.status)">
                {{ schedule.startTime }}-{{ schedule.endTime }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker
            v-model="form.startTime"
            placeholder="选择时间"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker
            v-model="form.endTime"
            placeholder="选择时间"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="最大人数" prop="maxPatients">
          <el-input-number v-model="form.maxPatients" :min="1" :max="100" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="正常" value="ACTIVE" />
            <el-option label="已取消" value="CANCELLED" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.schedule-view {
  padding: clamp(12px, 2vw, 24px);
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.page-title {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  padding-left: 12px;
}

.page-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1.2em;
  background: linear-gradient(135deg, var(--primary-color), #669df6);
  border-radius: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.stats-row {
  margin-bottom: 1rem;
}

.stat-card {
  text-align: center;
  margin-bottom: 0.75rem;
}

.stat-value {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 700;
  color: #409eff;
}

.stat-label {
  font-size: clamp(0.7rem, 1vw, 0.85rem);
  color: #909399;
  margin-top: 4px;
}

.calendar-view {
  margin-top: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-weekday {
  text-align: center;
  padding: 8px;
  font-weight: 600;
  color: #606266;
  font-size: 0.85rem;
}

.calendar-day {
  min-height: 80px;
  background: #f5f7fa;
  border-radius: 4px;
  padding: 4px;
}

.calendar-day.is-current-month {
  background: #fff;
  border: 1px solid #e4e7ed;
}

.calendar-day.is-today {
  background: #ecf5ff;
  border: 1px solid #409eff;
}

.day-content {
  height: 100%;
}

.day-date {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.schedule-tag {
  margin-bottom: 2px;
}

@media (max-width: 768px) {
  .schedule-view {
    padding: 0.75rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .calendar-day {
    min-height: 60px;
  }

  .day-date {
    font-size: 0.75rem;
  }

  .schedule-tag .el-tag {
    font-size: 0.65rem;
  }
}
</style>
