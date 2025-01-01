// src/api.ts
import axiosInstance from "./axiosConfig";

export interface User {
  id: number;
  name: string;
  email: string;
}

export const getAllForms = async (
  templateId: string | undefined
): Promise<User> => {
  const response = await axiosInstance.get<User>(
    `/forms/${templateId ? `${templateId}/` : ""}`
  );

  return response.data;
};

export const saveForm = async (data: Partial<any>): Promise<any> => {
  const response = await axiosInstance.post<any>("/forms/", data);
  return response.data;
};

export const updateForm = async (
  data: Partial<any>
): Promise<any> => {
  console.log("formId", data.id);
  const response = await axiosInstance.patch<any>(`/forms/${data.id}/`, data);
  return response.data;
};

export const deleteForm = async (formId: string): Promise<void> => {
  await axiosInstance.delete(`/forms/${formId}`);
}

export const login = async (data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.post<User>("/users/login/", data);
  return response.data;
};

export const isAdmin = async (): Promise<boolean> => {
  const response = await axiosInstance.get<boolean>("/users/isAdmin/");
  return response.data;
};

export const updateUser = async (
  userId: number,
  data: Partial<User>
): Promise<User> => {
  const response = await axiosInstance.put<User>(`/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await axiosInstance.delete(`/users/${userId}`);
};
