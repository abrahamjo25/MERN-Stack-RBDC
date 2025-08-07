// services/apiService.ts
import axios from "@/lib/axios";
import { toast } from "sonner";

const handleError = (error: any) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.title ||
    error?.message ||
    "Something went wrong";
  toast.error(message);

  throw error;
};

export const apiService = {
  get: async <T = any>(url: string, params?: any) => {
    try {
      const res = await axios.get<T>(url, { params });
      return res;
    } catch (err) {
      handleError(err);
    }
  },

  post: async <T = any>(url: string, data?: any) => {
    try {
      const res = await axios.post<T>(url, data);
      return res;
    } catch (err) {
      handleError(err);
    }
  },

  put: async <T = any>(url: string, data?: any) => {
    try {
      const res = await axios.put<T>(url, data);
      return res;
    } catch (err) {
      handleError(err);
    }
  },

  patch: async <T = any>(url: string, data?: any) => {
    try {
      const res = await axios.patch<T>(url, data);
      return res;
    } catch (err) {
      handleError(err);
    }
  },

  delete: async <T = any>(url: string) => {
    try {
      const res = await axios.delete<T>(url);
      return res;
    } catch (err) {
      handleError(err);
    }
  },
};
