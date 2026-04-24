<template>
  <div class="doctor-card" @click="$emit('click')">
    <div class="doctor-avatar">
      <van-icon name="manager" size="32" color="#fff" />
    </div>
    <div class="doctor-info">
      <div class="doctor-name">
        <span class="name">{{ doctor.userName }}</span>
        <span class="title" v-if="doctor.title">{{ doctor.title }}</span>
      </div>
      <div class="department" v-if="doctor.departmentName">
        <van-icon name="label-o" size="12" />
        {{ doctor.departmentName }}
      </div>
      <div class="specialty" v-if="doctor.specialty">
        擅长：{{ doctor.specialty }}
      </div>
    </div>
    <div class="doctor-action" v-if="showAction">
      <van-button type="primary" size="small" round>
        预约挂号
      </van-button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  doctor: {
    type: Object,
    required: true,
  },
  showAction: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.doctor-card {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
}

.doctor-card:active {
  transform: scale(0.98);
}

.doctor-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doctor-info {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}

.doctor-name {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.title {
  font-size: 12px;
  color: #fff;
  background: #4facfe;
  padding: 2px 8px;
  border-radius: 4px;
}

.department {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.specialty {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doctor-action {
  flex-shrink: 0;
  margin-left: 12px;
  align-self: center;
}
</style>
