<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Search, Calendar, Plus, Warning, RefreshLeft } from '@element-plus/icons-vue'
import { getSchedules, getDoctors, getDepartments, createSchedule, updateSchedule, deleteSchedule } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { Schedule, Doctor, Department } from '@/types'
import PaginationBar from '@/components/PaginationBar.vue'

const loading = ref(false)
const schedules = ref<Schedule[]>([])
const doctors = ref<Doctor[]>([])
const departments = ref<Department[]>([])
const dialogVisible = ref(false)
const batchDialogVisible = ref(false)
const dialogTitle = ref('添加排班')
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedDoctor = ref('')
const scheduleCycle = ref<'daily' | 'weekly' | 'monthly'>('daily')
const dateRange = ref<[string, string] | null>(null)

const form = ref({
  id: null as number | null,
  doctorId: null as number | null,
  date: '',
  startTime: '',
  endTime: '',
  maxPatients: 20,
  status: 'ACTIVE',
})

const batchForm = ref({
  doctorIds: [] as number[],
  startDate: '',
  endDate: '',
  startTime: '09:00',
  endTime: '17:00',
  maxPatients: 20,
})

const rules = {
  doctorId: [{ required: true, message: '请选择医生', trigger: 'change' }],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  maxPatients: [{ required: true, message: '请输入最大预约人数', trigger: 'blur' }],
}

const filteredSchedules = computed(() => {
  let result = schedules.value

  if (selectedDepartment.value) {
    result = result.filter((s) => s.departmentId.toString() === selectedDepartment.value)
  }

  if (selectedDoctor.value) {
    result = result.filter((s) => s.doctorId.toString() === selectedDoctor.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (s) =>
        s.doctorName?.toLowerCase().includes(q) ||
        s.departmentName?.toLowerCase().includes(q)
    )
  }

  return result
})

const departmentOptions = computed(() => {
  const depts = departments.value
  return depts.map((d) => ({ label: d.name, value: d.id.toString() }))
})

const doctorOptions = computed(() => {
  let docs = doctors.value
  if (selectedDepartment.value) {
    docs = docs.filter((d) => d.departmentId.toString() === selectedDepartment.value)
  }
  return docs.map((d) => ({ label: d.userName, value: d.id }))
})

const loadSchedules = async () => {
  loading.value = true
  try {
    const res = await getSchedules()
    schedules.value = res.data
  } catch (error) {
    ElMessage.error('加载排班失败')
  } finally {
    loading.value = false
  }
}

const loadData = async () => {
  try {
    const [deptRes, docRes] = await Promise.all([getDepartments(), getDoctors()])
    departments.value = deptRes.data
    doctors.value = docRes.data
  } catch (error) {
    console.error('加载基础数据失败')
  }
}

const checkScheduleConflict = (doctorId: number, date: string, startTime: string, endTime: string): string[] => {
  const conflicts: string[] = []

  const doctorSchedules = schedules.value.filter(
    (s) => s.doctorId === doctorId && s.date === date && s.status === 'ACTIVE'
  )

  for (const existing of doctorSchedules) {
    const existingStart = existing.startTime || ''
    const existingEnd = existing.endTime || ''
    if (
      (startTime >= existingStart && startTime < existingEnd) ||
      (endTime > existingStart && endTime <= existingEnd) ||
      (startTime <= existingStart && endTime >= existingEnd)
    ) {
      conflicts.push(`时间冲突：${date} ${existingStart}-${existingEnd} 已存在排班`)
    }
  }

  const weeklyHours = schedules.value
    .filter((s) => s.doctorId === doctorId && s.status === 'ACTIVE' && s.date.startsWith(date.substring(0, 8)))
    .reduce((sum, s) => {
      const startStr = s.startTime ?? '00:00'
      const endStr = s.endTime ?? '00:00'
      const startHour = parseInt(startStr.split(':')[0] ?? '0')
      const endHour = parseInt(endStr.split(':')[0] ?? '0')
      return sum + (endHour - startHour)
    }, 0)

  const startStr2 = startTime ?? '00:00'
  const endStr2 = endTime ?? '00:00'
  const startH = parseInt(startStr2.split(':')[0] ?? '0')
  const endH = parseInt(endStr2.split(':')[0] ?? '0')
  const newHours = endH - startH
  if (weeklyHours + newHours > 40) {
    conflicts.push(`负荷超限：该医生本周已排班${weeklyHours}小时，新增${newHours}小时将超过40小时上限`)
  }

  return conflicts
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加排班'
  form.value = { id: null, doctorId: null, date: '', startTime: '', endTime: '', maxPatients: 20, status: 'ACTIVE' }
  dialogVisible.value = true
}

const handleEdit = (row: Schedule) => {
  isEdit.value = true
  dialogTitle.value = '编辑排班'
  form.value = {
    id: row.id,
    doctorId: row.doctorId,
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
      if (!isEdit.value && form.value.doctorId && form.value.date && form.value.startTime && form.value.endTime) {
        const conflicts = checkScheduleConflict(
          form.value.doctorId,
          form.value.date,
          form.value.startTime,
          form.value.endTime
        )
        if (conflicts.length > 0) {
          try {
            await ElMessageBox.confirm(
              `检测到排班冲突：\n${conflicts.join('\n')}\n\n是否继续创建？`,
              '排班冲突警告',
              { type: 'warning' }
            )
          } catch {
            return
          }
        }
      }

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
          if (form.value.doctorId) {
            await createSchedule({
              doctor: { id: form.value.doctorId },
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

const handleBatchAdd = () => {
  batchForm.value = {
    doctorIds: [],
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    maxPatients: 20,
  }
  batchDialogVisible.value = true
}

const handleBatchSubmit = async () => {
  if (!batchForm.value.doctorIds.length || !batchForm.value.startDate || !batchForm.value.endDate) {
    ElMessage.warning('请填写完整的批量排班信息')
    return
  }

  const dates: string[] = []
  const start = new Date(batchForm.value.startDate || '')
  const end = new Date(batchForm.value.endDate || '')
  const current = new Date(start)

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0] ?? ''
    dates.push(dateStr)
    current.setDate(current.getDate() + 1)
  }

  if (scheduleCycle.value === 'weekly') {
    const filtered = dates.filter((d) => {
      const day = new Date(d).getDay()
      return day >= 1 && day <= 5
    })
    dates.length = 0
    dates.push(...filtered)
  } else if (scheduleCycle.value === 'monthly') {
    const daysInMonth = dates.length
    if (daysInMonth > 0) {
      const step = Math.floor(daysInMonth / 4)
      const filtered = dates.filter((_, i) => i % step === 0)
      dates.length = 0
      dates.push(...filtered)
    }
  }

  let successCount = 0
  let conflictCount = 0

  for (const doctorId of batchForm.value.doctorIds) {
    for (const date of dates) {
      const startTime = batchForm.value.startTime || '09:00'
      const endTime = batchForm.value.endTime || '17:00'
      const conflicts = checkScheduleConflict(doctorId, date, startTime, endTime)
      if (conflicts.length > 0) {
        conflictCount++
        continue
      }

      try {
        await createSchedule({
          doctor: { id: doctorId },
          date,
          startTime,
          endTime,
          maxPatients: batchForm.value.maxPatients,
        })
        successCount++
      } catch {
        conflictCount++
      }
    }
  }

  ElMessage.success(`批量创建完成：成功${successCount}条，跳过冲突${conflictCount}条`)
  batchDialogVisible.value = false
  loadSchedules()
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

const handleReset = () => {
  selectedDepartment.value = ''
  selectedDoctor.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedSchedules = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSchedules.value.slice(start, end)
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

const getSlotPercent = (row: Schedule) => {
  if (row.maxPatients === 0) return 0
  return ((row.maxPatients - row.availableSlots) / row.maxPatients) * 100
}

const getSlotColor = (percent: number) => {
  if (percent >= 90) return '#f56c6c'
  if (percent >= 70) return '#e6a23c'
  return '#67c23a'
}

onMounted(() => {
  loadSchedules()
  loadData()
})
</script>

<template>
  <div class="schedule-management-view">
    <div class="page-header">
      <h2 class="page-title">排班管理</h2>
      <div class="header-actions">
        <el-button @click="handleReset" :icon="RefreshLeft">重置筛选</el-button>
        <el-button type="primary" @click="handleAdd" :icon="Plus">添加排班</el-button>
        <el-button type="success" @click="handleBatchAdd" :icon="Calendar">批量排班</el-button>
      </div>
    </div>

    <el-card class="filter-card" shadow="never">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="8" :md="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜索医生/科室"
            :prefix-icon="Search"
            clearable
            @input="() => {}"
          />
        </el-col>
        <el-col :xs="24" :sm="8" :md="5">
          <el-select v-model="selectedDepartment" placeholder="选择科室" clearable style="width: 100%">
            <el-option label="全部科室" value="" />
            <el-option v-for="dept in departmentOptions" :key="dept.value" :label="dept.label" :value="dept.value" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="5">
          <el-select v-model="selectedDoctor" placeholder="选择医生" clearable style="width: 100%">
            <el-option label="全部医生" :value="''" />
            <el-option v-for="doc in doctorOptions" :key="doc.value" :label="doc.label" :value="doc.value" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="4">
          <el-tag size="large" type="info">
            总计：{{ filteredSchedules.length }} 条
          </el-tag>
        </el-col>
      </el-row>
    </el-card>

    <el-table v-loading="loading" :data="paginatedSchedules" style="width: 100%; margin-top: 16px" stripe>
      <el-table-column prop="doctorName" label="医生姓名" width="120" />
      <el-table-column prop="departmentName" label="科室" width="120" />
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="startTime" label="开始时间" width="100" />
      <el-table-column prop="endTime" label="结束时间" width="100" />
      <el-table-column label="预约进度" width="180">
        <template #default="{ row }">
          <div class="slot-progress">
            <el-progress
              :percentage="getSlotPercent(row)"
              :color="getSlotColor(getSlotPercent(row))"
              :stroke-width="12"
              :show-text="false"
            />
            <span class="slot-text">{{ row.maxPatients - row.availableSlots }}/{{ row.maxPatients }}</span>
          </div>
        </template>
      </el-table-column>
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
      v-if="filteredSchedules.length > 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="filteredSchedules.length"
      @change="handlePageChange"
    />

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="医生" prop="doctorId">
          <el-select v-model="form.doctorId" placeholder="选择医生" style="width: 100%" :disabled="isEdit">
            <el-option v-for="doc in doctors" :key="doc.id" :label="doc.userName" :value="doc.id" />
          </el-select>
        </el-form-item>
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

    <el-dialog v-model="batchDialogVisible" title="批量排班" width="600px">
      <el-form :model="batchForm" label-width="120px">
        <el-form-item label="选择医生">
          <el-select
            v-model="batchForm.doctorIds"
            multiple
            placeholder="可多选"
            style="width: 100%"
            filterable
          >
            <el-option v-for="doc in doctors" :key="doc.id" :label="doc.userName" :value="doc.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排班周期">
          <el-radio-group v-model="scheduleCycle">
            <el-radio-button label="daily">每日</el-radio-button>
            <el-radio-button label="weekly">工作日</el-radio-button>
            <el-radio-button label="monthly">按月分布</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            @change="(val: any) => {
              batchForm.startDate = val?.[0] || ''
              batchForm.endDate = val?.[1] || ''
            }"
          />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-time-picker v-model="batchForm.startTime" value-format="HH:mm" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-time-picker v-model="batchForm.endTime" value-format="HH:mm" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="最大人数">
          <el-input-number v-model="batchForm.maxPatients" :min="1" :max="100" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchSubmit">批量创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.schedule-management-view {
  padding: 1rem;
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
  color: #303133;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-card {
  border-radius: 8px;
}

.filter-card :deep(.el-card__body) {
  padding: clamp(0.75rem, 2vw, 1rem);
}

.slot-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slot-text {
  font-size: 0.75rem;
  color: #909399;
}

@media (max-width: 768px) {
  .schedule-management-view {
    padding: 0.75rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }
}
</style>
