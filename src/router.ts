import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('./views/main.vue'),
    },
    {
      path: '/help_documents',
      name: 'help_documents',
      component: () => import('./views/help_documents/help_documents.vue'),
    },
    {
      path: '/information',
      name: 'information',
      component: () => import('./views/information/information.vue'),
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('./views/feedback/feedback.vue'),
    },
    {
      path: '/feedback/:id',
      name: 'feedback_detail',
      component: () => import('./views/feedback/feedback_detail.vue'),
    },
    {
      path: '/feedback/new',
      name: 'new_feedback',
      component: () => import('./views/feedback/new_feedback.vue'),
    },
    {
      path: '/download_files',
      name: 'download_files',
      component: () => import('./views/download_files/download_files.vue'),
    },
    {
      path: '/translation',
      name: 'translation',
      component: () => import('./views/translation/translation.vue'),
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: () => import('./views/qrcode/qrcode.vue'),
    },
    {
      path: '/chatting_room',
      name: 'chatting_room',
      component: () => import('./views/chatting_room/chatting_room.vue'),
    },
    {
      path: '/ai_chatting',
      name: 'ai_chatting',
      component: () => import('./views/ai_chatting/ai_chatting.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/accounts/login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/accounts/register.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/accounts/profile.vue'),
    },
    {
      path: '/forget_password',
      name: 'forget_password',
      component: () => import('./views/accounts/forget_password.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/about/about.vue'),
    },
    {
      path: '/:path(.*)*',
      name: 'error',
      component: () => import('./views/error.vue'),
    },
  ],
})

export default router
