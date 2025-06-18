import { deleteUser } from "@/api/users";
import { useDebounce } from "@/hooks/useDebounce";
import Modal from "@/shared/Modal/Modal";
import { IUser } from "@/types/IUser";
import { useEffect, useRef, useState } from "react";
import css from "./AllUsersPage.module.css";
import UsersForm from "./components/UsersForm/UsersForm";
import UsersSelect from "./components/UsersSelect/UsersSelect";
import useQuery from "./hooks/useQuery";
import { useSearchAndSort } from "./hooks/useSearchAndSort";
import { filterUsers } from "./utils/filterUsers";
import { formatDate } from "./utils/formatDate";
import { sortUsers } from "./utils/sortUsers";

const AllUsersPage = () => {
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<IUser | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCreatingInModal, setIsCreatingInModal] = useState(false);
  const {
    users,
    totalUsers,
    isLoading,
    isLoadingMore,
    error,
    observerTarget,
    lastOptionRef,
    isFetchedUsersLoading,
    fetchedUsers,
    fetchedUsersError,
    page,
    totalPages,
    setTotalUsers,
    setUsers,
    setError,
  } = useQuery();
  const {
    searchTerm,
    sortConfig,
    filteredUsers,
    setSearchTerm,
    sortByBirthDate,
    sortByFullName,
    sortByGender,
    setFilteredUsers,
  } = useSearchAndSort(users);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);

    if (!selectedId) {
      setSelectedValue(null);
      setIsCreating(false);
      timeoutRef.current = setTimeout(() => {
        if (selectRef.current) {
          selectRef.current.blur();
        }
      }, 0);
      return;
    }

    const selectedUser = fetchedUsers.find((user) => user.id === selectedId);

    if (selectedUser) {
      setSelectedValue(selectedUser);
      setIsCreating(true);
    }

    timeoutRef.current = setTimeout(() => {
      if (selectRef.current) {
        selectRef.current.blur();
      }
    }, 0);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSelectFocus = () => {
    setIsSelectOpen(true);
  };

  const handleSelectBlur = () => {
    setIsSelectOpen(false);
  };

  useEffect(() => {
    const result = filterUsers(users, debouncedSearchTerm);
    setFilteredUsers(result);
  }, [debouncedSearchTerm, setFilteredUsers, users]);

  const handleCreateUser = (user: IUser) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setTotalUsers((prev) => prev + 1);
    localStorage.setItem(
      "usersMeta",
      JSON.stringify({ total: totalUsers + 1, totalPages })
    );

    setSelectedValue(null);
    setIsCreating(false);
    if (selectRef.current) {
      selectRef.current.value = "";
    }
  };

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  const handleUpdateUser = (user: IUser) => {
    const updatedUser = { ...user, updatedAt: new Date().toISOString() };

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);

      const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setTotalUsers((prev) => prev - 1);
      localStorage.setItem(
        "usersMeta",
        JSON.stringify({ total: totalUsers - 1, totalPages })
      );

      setUserToDelete(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ошибка при удалении пользователя"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='container'>
      <section>
        <h1 className={css.header}>Список пользователей</h1>
        <div>
          <input
            type="text"
            placeholder="Поиск по фамилии"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={css.searchInput}
          />
        </div>

        {!isCreatingInModal && selectRef && lastOptionRef && (
          <div className={`${css.addUserSection} ${isCreating && css.addUserSectionOpen}`}>
            <h2>Добавить пользователя</h2>
            <UsersSelect
              selectRef={selectRef}
              isSize={isSelectOpen}
              selectedValue={selectedValue}
              onChange={handleSelectChange}
              onFocus={handleSelectFocus}
              onBlur={handleSelectBlur}
              isFetchedUsersLoading={isFetchedUsersLoading}
              fetchedUsersError={fetchedUsersError}
              fetchedUsers={fetchedUsers}
              users={users}
              lastOptionRef={lastOptionRef}
              page={page}
            />

            {selectedValue && isCreating && (
              <UsersForm
                mode="create"
                user={selectedValue}
                onClose={() => {
                  setIsCreating(false);
                  setSelectedValue(null);
                }}
                onSave={handleCreateUser}
              />
            )}
          </div>
        )}

        <table className={css.usersTable}>
          <thead>
            <tr>
              <th>Аватар</th>
              <th onClick={sortByFullName} className={css.pointer}>Полное имя</th>
              <th>Email</th>
              <th onClick={sortByGender} className={css.pointer}>Пол</th>
              <th onClick={sortByBirthDate} className={css.pointer}>Дата роджения</th>
              <th aria-label="Колонка Управления"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <>
                <tr>
                  <td colSpan={6} className={css.noUsers}>Пользователи не найдены</td>
                </tr>
                <tr>
                  <td colSpan={6}>
                    <button
                      className={css.addButton}
                      onClick={() => {
                        setIsCreatingInModal(true);
                      }}
                    >
                      Добавить
                    </button>
                  </td>
                </tr>
              </>
            )}

            {isCreatingInModal && (
              <Modal isOpen onClose={() => setIsCreatingInModal(false)}>
                <div className={css.modalContent}>
                  <h2>Добавить пользователя</h2>
                  <UsersSelect
                    selectRef={selectRef}
                    isSize={isSelectOpen}
                    selectedValue={selectedValue}
                    onChange={handleSelectChange}
                    onFocus={handleSelectFocus}
                    onBlur={handleSelectBlur}
                    isFetchedUsersLoading={isFetchedUsersLoading}
                    fetchedUsersError={fetchedUsersError}
                    fetchedUsers={fetchedUsers}
                    users={users}
                    lastOptionRef={lastOptionRef}
                    page={page}
                  />
                  {!selectedValue && (
                    <div className={css.modalButtons}>
                      <button 
                        className={css.cancelButton}
                        onClick={() => setIsCreatingInModal(false)}
                      >
                        Отмена
                      </button>
                    </div>
                  )}

                  {selectedValue && isCreating && (
                    <UsersForm
                      mode="create"
                      user={selectedValue}
                      onClose={() => {
                        setIsCreatingInModal(false);
                        setSelectedValue(null);
                      }}
                      onSave={handleCreateUser}
                    />
                  )}
                </div>
              </Modal>
            )}

            {sortUsers(filteredUsers, sortConfig).map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.avatar}
                    alt={`Аватар ${user.last_name} ${user.first_name[0]}.`}
                    className={css.avatar}
                  />
                </td>
                <td>
                  {user.last_name} {user.first_name[0]}.
                </td>
                <td>{user.email}</td>
                <td>{user.gender === "male" ? "Мужской" : "Женский"}</td>
                <td>{formatDate(user.birth_date)}</td>
                <td>
                  <button 
                    className={css.editButton}
                    onClick={() => handleEditUser(user)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className={css.deleteButton}
                    onClick={() => setUserToDelete(user)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div ref={observerTarget} style={{ height: "20px", margin: "10px 0" }}>
          {isLoadingMore && <div className={css.loadingIndicator}>Загрузка...</div>}
        </div>

        {userToDelete && (
          <Modal isOpen onClose={() => setUserToDelete(null)}>
            <div className={css.modalContent}>
              <p>Вы действительно хотите удалить пользователя?</p>
              <p>
                {userToDelete.first_name} {userToDelete.last_name}
              </p>
              <div className={css.modalButtons}>
                <button 
                  className={css.confirmButton} 
                  onClick={handleDeleteUser} 
                  disabled={isDeleting}
                >
                  {isDeleting ? "Удаление..." : "Удалить"}
                </button>
                <button 
                  className={css.cancelButton}
                  onClick={() => setUserToDelete(null)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </Modal>
        )}

        {isEditing && editingUser && (
          <Modal isOpen onClose={() => setIsEditing(false)}>
            <div className={css.modalContent}>
              <UsersForm
                mode="edit"
                user={editingUser}
                onClose={() => setIsEditing(false)}
                onSave={handleUpdateUser}
              />
            </div>
          </Modal>
        )}
      </section>
    </div>
  );
};

export default AllUsersPage;
