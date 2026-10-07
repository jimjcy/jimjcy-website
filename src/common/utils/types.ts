interface themeItem {
  name: string;
  display: string;
  color: string;
}

export const theme: themeItem[] = [
  { name: 'light', display: '浅色主题', color: '#e0e0e0' },
  { name: 'dark', display: '深色主题', color: '#0d1117' },
  { name: 'orange', display: '橙色主题', color: '#ffc107' },
  { name: 'cyan', display: '青绿色主题', color: '#a6ffcb' },
  { name: 'purple', display: '紫色主题', color: '#5e3f8c' },
  // { name: "auto", display: "跟随系统", color: "linear-gradient(to right, #0d1117, #e0e0e0)"}
];
