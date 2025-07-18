import axios from "axios";
import getToken from "../utils/authUtils";

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const testServerConnection = async () => {
  try {
    console.log(`Testing connection to: ${baseUrl}`);
    const response = await axios.get(`${baseUrl}`, { timeout: 5000 });
    
    console.log('✅ Successfully connected to server:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('Please check:');
    console.log('1. Server is running at', baseUrl);
    console.log('2. IP address is correct');
    console.log('3. Devices are on same network');
    console.log('4. Firewall allows connections');
    return false;
  }
};

export default api;
