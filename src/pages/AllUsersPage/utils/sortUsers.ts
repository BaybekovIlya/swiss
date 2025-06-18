import { IUser } from "@/types";
import { SortConfig } from "../types/SortConfig";

export const sortUsers = (users: IUser[], sortConfig: SortConfig | null) => {
    if (!sortConfig) return users;

    return [...users].sort((a, b) => {
      if (sortConfig.key === "fullName") {
        const nameA = `${a.last_name} ${a.first_name[0]}.`;
        const nameB = `${b.last_name} ${b.first_name[0]}.`;
        return sortConfig.direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }

      const key = sortConfig.key;
      const valA = a[key];
      const valB = b[key];

      if (valA == null || valB == null) {
        if (valA == null && valB == null) return 0;
        return valA == null
          ? sortConfig.direction === "asc"
            ? -1
            : 1
          : sortConfig.direction === "asc"
          ? 1
          : -1;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }

      if (key === "birth_date") {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });
  };