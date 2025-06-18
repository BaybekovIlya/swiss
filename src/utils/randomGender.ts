import { UserGender } from "@/types";

export const randomGender = (): UserGender => {
  return Math.random() > 0.5 ? "male" : "female";
};
