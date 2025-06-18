import { fetchAllUsers } from "@/api/users";
import { featureToggle } from "@/featureToggles";
import { IUser } from "@/types";
import { randomBirthDate } from "@/utils/randomBirthDate";
import { randomGender } from "@/utils/randomGender";
import { randomRole } from "@/utils/randomRole";
import { setupIntersectionObserver } from "@/utils/setupIntersectionObserver";
import { useEffect, useRef, useState } from "react";

const useQuery = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<string>("");
  const [fetchedUsers, setFetchedUsers] = useState<IUser[]>([]);
  const [fetchedUsersError, setFetchedUsersError] = useState<string>("");
  const [isFetchedUsersLoading, setIsFetchedUsersLoading] =
    useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [selectPage, setSelectPage] = useState<number>(1);
  const [hasSelectMore, setHasSelectMore] = useState<boolean>(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const lastOptionRef = useRef<HTMLOptionElement | null>(null);

  const fetchUsers = async (pageNum = 1) => {
    try {
      setFetchedUsersError("");
      const response = await fetchAllUsers(pageNum);
      setFetchedUsers((prev) =>
        pageNum === 1 ? response.data : [...prev, ...response.data]
      );
      setHasSelectMore(response.data.length > 0);
      setSelectPage(pageNum);
    } catch (error) {
      setFetchedUsersError(
        error instanceof Error
          ? error.message
          : "Неизвестная ошибка, попробуйте снова"
      );
    } finally {
      setIsFetchedUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!lastOptionRef.current || !hasSelectMore || isFetchedUsersLoading)
      return;

    const cleanup = setupIntersectionObserver(
      lastOptionRef.current,
      () => fetchUsers(selectPage + 1),
      fetchedUsers.length < totalUsers,
      { threshold: 0.1 }
    );

    return cleanup;
  }, [
    isFetchedUsersLoading,
    fetchedUsers,
    hasSelectMore,
    selectPage,
    totalUsers,
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError("");
        const savedUsers = localStorage.getItem("users");
        const savedMeta = localStorage.getItem("usersMeta");

        if (savedUsers && savedMeta) {
          const { total, totalPages } = JSON.parse(savedMeta);
          setUsers(JSON.parse(savedUsers));
          setTotalUsers(total);
          setTotalPages(totalPages);
          setIsLoading(false);
          return;
        }

        const response = await fetchAllUsers(page);
        const usersWithExtraFields = response.data.map((user) => ({
          ...user,
          gender: randomGender(),
          birth_date: randomBirthDate(),
          role: randomRole(),
        }));

        localStorage.setItem("users", JSON.stringify(usersWithExtraFields));
        localStorage.setItem(
          "usersMeta",
          JSON.stringify({
            total: response.total,
            totalPages: response.totalPages,
          })
        );

        setUsers(usersWithExtraFields);
        setTotalUsers(response.total);
        setTotalPages(response.totalPages);
        setIsLoading(false);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Неизвестная ошибка, попробуйте снова"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  useEffect(() => {
    const currentObserverTarget = observerTarget.current;
    const loadMoreUsers = async () => {
      if (page >= totalPages || isLoadingMore) return;

      setIsLoadingMore(true);
      try {
        const nextPage = page + 1;
        const response = await fetchAllUsers(nextPage);
        const newUsers = response.data.map((user) => ({
          ...user,
          gender: randomGender(),
          birth_date: randomBirthDate(),
          role: randomRole(),
        }));

        const updatedUsers = [...users, ...newUsers];
        setUsers(updatedUsers);
        setPage(nextPage);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Ошибка при загрузке дополнительных пользователей"
        );
      } finally {
        setIsLoadingMore(false);
      }
    };

    if (featureToggle.isTableIntersectionOvserver && currentObserverTarget) {
      setupIntersectionObserver(
        currentObserverTarget,
        loadMoreUsers,
        users.length < totalUsers
      );
    }
  }, [users, totalUsers, page, totalPages, isLoadingMore]);

  return {
    users,
    totalUsers,
    isLoading,
    isLoadingMore,
    error,
    observerTarget,
    lastOptionRef,
    selectPage,
    hasSelectMore,
    isFetchedUsersLoading,
    fetchedUsers,
    fetchedUsersError,
    page,
    totalPages,
    setPage,
    setUsers,
    setError,
    setHasSelectMore,
    setSelectPage,
    setFetchedUsers,
    setFetchedUsersError,
    setIsFetchedUsersLoading,
    setTotalPages,
    setTotalUsers,
  };
};

export default useQuery;
