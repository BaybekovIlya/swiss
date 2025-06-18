export const randomBirthDate = () => {
  const randomDate = new Date(
    1990 + Math.floor(Math.random() * 20),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28)
  )
    .toISOString()
    .split("T")[0];

  return randomDate;
};
