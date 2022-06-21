export default function calculateAge(
  birthDate: Date | string,
  today = new Date()
) {
  const birthDateDate =
    typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  const monthsDifference = today.getMonth() - birthDateDate.getMonth();
  const birthdayThisYearNotYet =
    monthsDifference < 0 ||
    (monthsDifference === 0 && today.getDate() < birthDateDate.getDate());
  const age =
    today.getFullYear() -
    birthDateDate.getFullYear() -
    (birthdayThisYearNotYet ? 1 : 0);
  return age;
}
