import { createRouter, createWebHistory } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    fullscreen?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('./views/main/main.vue'),
      meta: {
        title: '主页',
      },
    },
    {
      path: '/help_documents',
      name: 'help_documents',
      component: () => import('./views/help_documents/help_documents.vue'),
      meta: {
        title: '帮助文档',
      },
    },
    {
      path: '/information',
      name: 'information',
      component: () => import('./views/information/information.vue'),
      meta: {
        title: '网站资讯',
      },
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('./views/feedback/feedback.vue'),
      meta: {
        title: '反馈',
      },
      children: [
        {
          path: ':id',
          name: 'feedback_detail',
          component: () => import('./views/feedback/feedback_detail.vue'),
        },
        {
          path: 'new',
          name: 'new_feedback',
          component: () => import('./views/feedback/new_feedback.vue'),
        },
      ],
    },
    {
      path: '/download_files',
      name: 'download_files',
      component: () => import('./views/download_files/download_files.vue'),
      meta: {
        title: '下载文件',
      },
    },
    {
      path: '/translation',
      name: 'translation',
      component: () => import('./views/translation/translation.vue'),
      meta: {
        title: '翻译',
      },
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: () => import('./views/qrcode/qrcode.vue'),
      meta: {
        title: '二维码',
      },
    },
    {
      path: '/chatting_room',
      name: 'chatting_room',
      component: () => import('./views/chattingRoom/chattingRoom.vue'),
      meta: {
        title: '聊天室',
      },
    },
    {
      path: '/ai_chatting',
      name: 'ai_chatting',
      component: () => import('./views/aiChatting/aiChatting.vue'),
      meta: {
        title: 'AI聊天',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/accounts/login.vue'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/accounts/register.vue'),
      meta: {
        title: '注册',
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/accounts/profile.vue'),
      meta: {
        title: '个人资料',
      },
    },
    {
      path: '/forget_password',
      name: 'forget_password',
      component: () => import('./views/accounts/forget_password.vue'),
      meta: {
        title: '忘记密码',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/about/about.vue'),
      meta: {
        title: '关于网站',
      },
    },
    {
      path: '/:path(.*)*',
      name: 'error',
      component: () => import('./views/error.vue'),
      meta: {
        title: '错误',
      },
    },
  ],
});

export default router;
