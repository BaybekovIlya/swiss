import { z } from "zod";

const validateAge = (dateStr: string) => {
  const birthDate = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age >= 18;
};

export const userSchema = z.object({
  id: z.number(),
  first_name: z.string().min(1, "Имя обязательно"),
  last_name: z.string().min(1, "Фамилия обязательна"),
  email: z.string().email("Некорректный email"),
  gender: z.enum(["male", "female"], {
    message: "Укажите пол",
  }),
  birth_date: z
    .string()
    .refine((val) => !!val, { message: "Дата рождения обязательна" })
    .refine(validateAge, { message: "Возраст должен быть ≥ 18 лет" }),
  role: z.enum(["doctor", "nurse", "admin"], {
    message: "Выберите роль",
  }),
});

export type UserFormData = z.infer<typeof userSchema>;
