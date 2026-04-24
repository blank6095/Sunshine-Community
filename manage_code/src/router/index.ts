import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      redirect: '/doctor/dashboard',
    },
    {
      path: '/doctor',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true, role: 'DOCTOR' },
      children: [
        {
          path: 'dashboard',
          name: 'doctor-dashboard',
          component: () => import('@/views/doctor/DashboardView.vue'),
        },
        {
          path: 'schedule',
          name: 'doctor-schedule',
          component: () => import('@/views/doctor/ScheduleView.vue'),
        },
        {
          path: 'appointments',
          name: 'doctor-appointments',
          component: () => import('@/views/doctor/AppointmentsView.vue'),
        },
        {
          path: 'profile',
          name: 'doctor-profile',
          component: () => import('@/views/doctor/ProfileView.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
        },
        {
          path: 'doctors',
          name: 'admin-doctors',
          component: () => import('@/views/admin/DoctorsView.vue'),
        },
        {
          path: 'departments',
          name: 'admin-departments',
          component: () => import('@/views/admin/DepartmentsView.vue'),
        },
        {
          path: 'schedules',
          name: 'admin-schedules',
          component: () => import('@/views/admin/ScheduleManagementView.vue'),
        },
        {
          path: 'appointments',
          name: 'admin-appointments',
          component: () => import('@/views/admin/AppointmentsView.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/UsersView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth !== false && !userStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.role && userStore.user?.role !== to.meta.role) {
    if (userStore.isAdmin) {
      return { name: 'admin-dashboard' }
    } else if (userStore.isDoctor) {
      return { name: 'doctor-dashboard' }
    }
    return { name: 'login' }
  }

  if (to.name === 'login' && userStore.isLoggedIn) {
    if (userStore.isAdmin) {
      return { name: 'admin-dashboard' }
    } else if (userStore.isDoctor) {
      return { name: 'doctor-dashboard' }
    }
  }

  return true
})

export default router
