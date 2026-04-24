<template>
  <div class="department-card" @click="$emit('click')">
    <div class="dept-icon">
      <slot name="icon">
        <van-icon name="bag-o" size="24" color="#4facfe" />
      </slot>
    </div>
    <div class="dept-info">
      <div class="dept-name">{{ department.name }}</div>
      <div class="dept-desc" v-if="department.description">
        {{ department.description }}
      </div>
    </div>
    <van-icon name="arrow" color="#ccc" />
  </div>
</template>

<script setup>
defineProps({
  department: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.department-card {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.dept-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dept-info {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}

.dept-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.dept-desc {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
