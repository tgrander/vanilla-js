export function formatDate(milliseconds: number) {
  const date = new Date(milliseconds);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString(); // Months are zero-based
  const day = date.getDate().toString();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'

  return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}
