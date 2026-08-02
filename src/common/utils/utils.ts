import axios from "axios";
export const titles = {
  home: "主页",
  help_documents: "帮助文档",
  information: "网站资讯",
  feedback: "报告问题",
  download_files: "下载资源",
  chatting_room: "聊天室",
  ai_chatting: "ai聊天",
  login: "登录",
  register: "注册",
  profile: "个人中心",
  about: "联系方式",
};

export const routes = {
  "/": "主页",
  // "/information": "网站资讯",
  "/ai_chatting": "ai聊天",
  "/chatting_room": "聊天室",
  // "/download_files": "下载资源",
  // "/help_documents": "帮助文档",
  // "/feedback": "报告问题",
  "/about": "联系方式",
};

export const theme = [
  { name: "light", display: "浅色主题", color: "#e0e0e0" },
  { name: "dark", display: "深色主题", color: "#0d1117" },
  { name: "orange", display: "橙色主题", color: "#ffc107" },
  { name: "cyan", display: "青绿色主题", color: "#a6ffcb" },
  { name: "purple", display: "紫色主题", color: "#5e3f8c" },
  // { name: "auto", display: "跟随系统", color: "linear-gradient(to right, #0d1117, #e0e0e0)"}
];

export const LOGOUTSESSID = "00000000000000000000000000000000";
export const req = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
export async function sendReq(path: string, data: any) {
  const response = await req.post(path, data);
  return response;
}

export default { titles, routes, theme, req, sendReq, LOGOUTSESSID };
