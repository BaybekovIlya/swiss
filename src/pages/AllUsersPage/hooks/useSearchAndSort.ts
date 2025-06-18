import { useDebounce } from "@/hooks/useDebounce";
import { IUser } from "@/types/IUser";
import { useEffect, useState } from "react";
import { SortableField } from "../types";
import { TableField } from "../types/enum";
import { SortConfig } from "../types/SortConfig";
import { filterUsers } from "../utils/filterUsers";
import { sortUsers } from "../utils/sortUsers";

export const useSearchAndSort = (users: IUser[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const result = filterUsers(users, debouncedSearchTerm);
    setFilteredUsers(result);
  }, [debouncedSearchTerm, users]);

  const requestSort = (key: SortableField | TableField.fullName) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortByFullName = () => requestSort(TableField.fullName);
  const sortByGender = () => requestSort(TableField.gender);
  const sortByBirthDate = () => requestSort(TableField.birthDate);

  const sortedUsers = sortUsers(filteredUsers, sortConfig);

  return {
    sortConfig,
    searchTerm,
    setSearchTerm,
    sortByFullName,
    sortByGender,
    sortByBirthDate,
    sortedUsers,
    filteredUsers,
    setFilteredUsers,
  };
};
