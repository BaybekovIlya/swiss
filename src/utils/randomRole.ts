import { UserRole } from "@/types";

export const randomRole = (): UserRole => {
  return Math.random() > 0.5 ? "doctor" : "nurse";
};
