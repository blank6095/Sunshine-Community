import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresAuth: false, hideTabbar: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresAuth: false, hideTabbar: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPasswordView.vue'),
      meta: { requiresAuth: false, hideTabbar: true },
    },
    {
      path: '/departments',
      name: 'departments',
      component: () => import('../views/departments/DepartmentListView.vue'),
    },
    {
      path: '/departments/:id',
      name: 'department-detail',
      component: () => import('../views/departments/DepartmentDetailView.vue'),
      meta: { hideTabbar: true },
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: () => import('../views/doctors/DoctorListView.vue'),
    },
    {
      path: '/doctors/:id',
      name: 'doctor-detail',
      component: () => import('../views/doctors/DoctorDetailView.vue'),
      meta: { hideTabbar: true },
    },
    {
      path: '/schedules',
      name: 'schedules',
      component: () => import('../views/appointments/ScheduleListView.vue'),
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: () => import('../views/appointments/AppointmentListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/appointments/history',
      name: 'appointments-history',
      component: () => import('../views/appointments/AppointmentHistoryView.vue'),
      meta: { requiresAuth: true, hideTabbar: true },
    },
    {
      path: '/appointments/:id',
      name: 'appointment-detail',
      component: () => import('../views/appointments/AppointmentDetailView.vue'),
      meta: { requiresAuth: true, hideTabbar: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('../views/profile/EditProfileView.vue'),
      meta: { requiresAuth: true, hideTabbar: true },
    },
    {
      path: '/profile/patients',
      name: 'profile-patients',
      component: () => import('../views/profile/PatientsView.vue'),
      meta: { requiresAuth: true, hideTabbar: true },
    },
    {
      path: '/profile/security',
      name: 'profile-security',
      component: () => import('../views/profile/SecurityView.vue'),
      meta: { requiresAuth: true, hideTabbar: true },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'register') && token) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
