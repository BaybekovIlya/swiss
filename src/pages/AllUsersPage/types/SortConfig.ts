import { SortableField } from "./SortableField";

export type SortConfig = {
  key: "fullName" | SortableField;
  direction: "asc" | "desc";
}