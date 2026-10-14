import axios from 'axios';

export const req = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
export async function sendReq(path: string, data: any) {
  const response = await req.post(path, data);
  return response;
}

export default { req, sendReq };
