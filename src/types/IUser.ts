export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  gender?: UserGender;
  birth_date?: string;
  role?: UserRole;
  updatedAt?: string;
}

export type UserGender = "male" | "female";
export type UserRole = "doctor" | "nurse" | "admin";
