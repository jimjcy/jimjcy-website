import axios from "axios";
const LOGOUTSESSIONID = "00000000000000000000000000000000";
const req = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
async function sendReq(path, data) {
  const response = await req.post(path, data);
  return response;
}

export default { req, LOGOUTSESSIONID };