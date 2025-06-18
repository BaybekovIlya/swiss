import { IUser } from "@/types";

export interface IUsersFormProps {
  mode: "create" | "edit";
  user: IUser;
  onClose: () => void;
  onSave?: (updatedUser: IUser) => void;
}
