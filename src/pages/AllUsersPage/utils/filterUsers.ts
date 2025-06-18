import { IUser } from "@/types";

export const filterUsers = (users: IUser[], searchTerm: string) => {
  return users.filter((user) =>
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};