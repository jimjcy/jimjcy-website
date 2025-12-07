import { createRouter, createWebHistory } from "vue-router";
import main from "./views/main.vue";
import profile from "./views/profile.vue";
import login from "./views/login.vue";
import register from "./views/register.vue";
import forget_password from "./views/forget_password.vue";
// import help_documents from './views/help_documents.vue'
// import infomation from './views/information.vue'
import report_issues from './views/report_issues.vue'
// import download_files from './views/download_files.vue'
// import translation from '/views/translation.vue'
// import qrcode from '/views/qrcode.vue'
import chatting_room from "./views/chatting_room.vue";
import ai_chatting from "./views/ai_chatting.vue";
import about from "./views/about.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: main,
    },
    {
      path: "/help_documents",
      name: "help_documents",
      // component: help_documents
    },
    {
      path: "/information",
      name: "information",
      // component: infomation
    },
    {
      path: "/report_issues",
      name: "report_issues",
      component: report_issues
    },
    {
      path: "/download_files",
      name: "download_files",
      // component: download_files
    },
    {
      path: "/translation",
      name: "translation",
      // component: translation
    },
    {
      path: "/qrcode",
      name: "qrcode",
      // component: qrcode
    },
    {
      path: "/chatting_room",
      name: "chatting_room",
      component: chatting_room,
    },
    {
      path: "/ai_chatting",
      name: "ai_chatting",
      component: ai_chatting,
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/register",
      name: "register",
      component: register,
    },
    {
      path: "/profile",
      name: "profile",
      component: profile,
    },
    {
      path: "/forget_password",
      name: "forget_password",
      component: forget_password,
    },
    {
      path: "/about",
      name: "about",
      component: about,
    },
  ],
});

export default router;
