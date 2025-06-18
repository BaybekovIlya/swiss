import { updateUser } from "@/api/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TableField } from "../../types/enum";
import { IUsersFormProps } from "./types";
import css from "./UsersForm.module.css";
import { UserFormData, userSchema } from "./utils/schemas";

const UsersForm: FC<IUsersFormProps> = ({ user, onClose, onSave, mode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    watch,
    setValue,
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user,
  });

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  const currentGender = watch(TableField.gender);
  const currentRole = watch(TableField.role);

  useEffect(() => {
    if (currentRole === "nurse") {
      setValue(TableField.role, "nurse", { shouldValidate: true });
    }
  }, [currentGender, currentRole, setValue]);
  const onSubmit = async (data: UserFormData) => {
    try {
      const updatedUser = await updateUser(data.id, data);
      onSave?.(updatedUser);
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
    }
  };

  if (Object.keys(errors).length > 0) {
    const firstError = Object.keys(errors)[0] as keyof UserFormData;
    setFocus(firstError);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
      {mode === "create" ? (
        <h3 className={css.title}>Создание пользователя</h3>
      ) : (
        <h3 className={css.title}>Редактирование пользователя</h3>
      )}

      <div className={css.formGroup}>
        <label className={css.label}>
          Имя:
          <input className={css.input} {...register(TableField.firstName)} />
          {errors.first_name && (
            <span className={css.error}>{errors.first_name.message}</span>
          )}
        </label>
      </div>

      <div className={css.formGroup}>
        <label className={css.label}>
          Фамилия:
          <input className={css.input} {...register(TableField.lastName)} />
          {errors.last_name && (
            <span className={css.error}>{errors.last_name.message}</span>
          )}
        </label>
      </div>

      <div className={css.formGroup}>
        <label className={css.label}>
          Email:
          <input
            type="email"
            className={css.input}
            {...register(TableField.email)}
          />
          {errors.email && (
            <span className={css.error}>{errors.email.message}</span>
          )}
        </label>
      </div>

      <div className={css.formGroup}>
        <label className={css.label}>
          Пол:
          <select className={css.select} {...register(TableField.gender)}>
            <option value="">Выберите пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
          {errors.gender && (
            <span className={css.error}>{errors.gender.message}</span>
          )}
        </label>
      </div>

      <div className={css.formGroup}>
        <label className={css.label}>
          Роль:
          <select className={css.select} {...register(TableField.role)}>
            <option value="">Выберите роль</option>
            <option value="doctor">Доктор</option>
            <option value="nurse">
              {currentGender === "male" ? "Медбрат" : "Медсестра"}
            </option>
            <option value="admin">Администратор</option>
          </select>
          {errors.role && (
            <span className={css.error}>{errors.role.message}</span>
          )}
        </label>
      </div>

      <div className={css.formGroup}>
        <label className={css.label}>
          Дата рождения:
          <input
            type="date"
            className={css.input}
            {...register(TableField.birthDate)}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.birth_date && (
            <span className={css.error}>{errors.birth_date.message}</span>
          )}
        </label>
      </div>

      {user.updatedAt && (
        <div className={css.formGroup}>
          <span className={css.lastUpdated}>
            Последнее обновление: {new Date(user.updatedAt).toLocaleString()}
          </span>
        </div>
      )}

      <div className={css.buttonGroup}>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Отмена
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
};

export default UsersForm;
