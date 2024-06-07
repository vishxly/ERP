import axios from "axios";
const BASE_URL = "https://erp-backend-zeta.vercel.app";
// const BASE_URL = "";
export default axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});
export const axiosImage = axios.create({
	baseURL: BASE_URL,
});
