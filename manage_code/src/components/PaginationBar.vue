<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  pageSize: number
  total: number
  pageSizes?: number[]
}

interface Emits {
  (e: 'update:currentPage', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change', page: number, pageSize: number): void
}

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50, 100],
})

const emit = defineEmits<Emits>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const startRecord = computed(() => {
  if (props.total === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const endRecord = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total)
})

const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  emit('update:currentPage', page)
  emit('change', page, props.pageSize)
}

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('change', 1, size)
}
</script>

<template>
  <div class="pagination-bar">
    <div class="pagination-info">
      <span class="info-text">
        共 <strong>{{ total }}</strong> 条记录，当前显示 {{ startRecord }}-{{ endRecord }} 条
      </span>
    </div>
    <div class="pagination-controls">
      <el-select
        :model-value="pageSize"
        @update:model-value="handleSizeChange"
        size="default"
        class="page-size-select"
      >
        <el-option
          v-for="size in pageSizes"
          :key="size"
          :label="`${size} 条/页`"
          :value="size"
        />
      </el-select>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        layout="prev, pager, next, jumper"
        background
        small
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 8px;
  margin-top: 8px;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 12px;
}

.pagination-info {
  display: flex;
  align-items: center;
}

.info-text {
  font-size: clamp(0.75rem, 1vw, 0.85rem);
  color: var(--text-secondary);
}

.info-text strong {
  color: var(--primary-color);
  font-weight: 600;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-size-select {
  width: 110px;
}

@media (max-width: 768px) {
  .pagination-bar {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 0 4px;
  }

  .pagination-controls {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .pagination-controls {
    flex-wrap: wrap;
    gap: 8px;
  }

  .page-size-select {
    width: 100px;
  }
}
</style>
