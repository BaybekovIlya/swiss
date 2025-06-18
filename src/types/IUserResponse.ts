import { IUser } from "./IUser";

export interface IUserResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: IUser[];
}
