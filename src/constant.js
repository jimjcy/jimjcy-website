const LOGOUTSESSIONID = "00000000000000000000000000000000";
const req = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
export default { req, LOGOUTSESSIONID };