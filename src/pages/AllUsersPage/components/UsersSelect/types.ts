import { IUser } from "@/types";
import { RefObject } from "react";

export interface IUsersSelectProps {
  selectRef: RefObject<HTMLSelectElement | null>;
  isSize: boolean;
  selectedValue: IUser | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  isFetchedUsersLoading: boolean;
  fetchedUsersError: string | null;
  fetchedUsers: IUser[];
  users: IUser[];
  lastOptionRef: RefObject<HTMLOptionElement | null>;
  page: number;
}