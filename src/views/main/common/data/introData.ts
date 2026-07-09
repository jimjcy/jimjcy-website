interface introType {
  title: string;
  subheading: string;
  content: string;
}
export const introData: Array<introType> = reactive([
  {
    title: "基本信息",
    subheading: "Basic Information",
    content: "",
  },
]);
