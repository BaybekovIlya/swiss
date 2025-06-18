import { IUser } from "@/types/IUser";
import { IUserResponse } from "@/types/IUserResponse";
import { client } from "./client";

export const fetchAllUsers = async (
  page: number = 1,
  perPage: number = 8
): Promise<IUserResponse> => {
  const response = await client.get<IUserResponse>(`/users`, {
    params: {
      page,
      per_page: perPage,
    },
  });

  return response.data;
};

export const fetchUser = async (id: number): Promise<IUser> => {
  const response = await client.get<IUser>(`/users/${id}`);

  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await client.delete(`/users/${id}`);
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Неизвестная ошибка");
  }
};

export const updateUser = async (id: number, user: IUser): Promise<IUser> => {
  try {
    const response = await client.put<IUser>(`/users/${id}`, user);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Неизвестная ошибка");
  }
};

export const createUser = async (id: number, user: IUser): Promise<IUser> => {
  try {
    const response = await client.patch<IUser>(`/users/${id}`, user);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Неизвестная ошибка");
  }
};
