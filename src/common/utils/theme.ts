const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
export function changeTheme(color: string | null = null) {
  if (!color) {
    color = systemTheme.matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = color;
  localStorage.theme = color;
}
systemTheme.addEventListener("change", (e) => {
  localStorage.theme = e.matches ? "dark" : "light";
  changeTheme(localStorage.theme);
});
addEventListener("storage", (ev) => {
  if (ev.storageArea === localStorage && ev.key === "theme") {
    changeTheme(ev.newValue || systemTheme.matches ? "dark" : "light");
  }
});
onMounted(() => {
  if (localStorage.theme === undefined) {
    localStorage.theme = systemTheme.matches ? "dark" : "light";
  }
  changeTheme(localStorage.theme);
});
