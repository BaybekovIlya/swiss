export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Дата не указана";
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Некорректная дата"
      : date.toLocaleDateString("ru-RU");
  } catch {
    return "Ошибка даты";
  }
};