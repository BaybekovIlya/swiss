import { FC } from "react";
import css from "./UsersSelect.module.css";
import { IUsersSelectProps } from "./types";

const UsersSelect: FC<IUsersSelectProps> = ({
  selectRef,
  isSize,
  selectedValue,
  onChange,
  onFocus,
  onBlur,
  isFetchedUsersLoading,
  fetchedUsersError,
  fetchedUsers,
  users,
  lastOptionRef,
  page,
}) => {
  return (
    <select
      className={css.select}
      ref={selectRef}
      size={isSize && !isFetchedUsersLoading ? 8 : undefined}
      value={selectedValue?.id || ""}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <option value="">Пользователь</option>
      {isFetchedUsersLoading && page === 1 && (
        <option disabled className={css.loadingOption}>
          Загрузка...
        </option>
      )}
      {fetchedUsersError && (
        <option disabled className={css.errorOption}>
          {fetchedUsersError}
        </option>
      )}
      {fetchedUsers.map((user, index) => (
        <option
          key={user.id}
          value={user.id}
          disabled={users.some((u) => u.id === user.id)}
          ref={index === fetchedUsers.length - 1 ? lastOptionRef : undefined}
          className={css.option}
        >
          {user.first_name} {user.last_name}
        </option>
      ))}
      {isFetchedUsersLoading && page > 1 && (
        <option disabled className={css.loadingOption}>
          Загрузка...
        </option>
      )}
    </select>
  );
};

export default UsersSelect;
