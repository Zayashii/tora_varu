// export const formatDateToString = (date) => {
//   return date.toISOString().split('T')[0];
// }

export const textFormatter = (text) => {
  const decoder = new TextDecoder("windows-1251");
  const bytes = new Uint8Array([...text].map(char => char.charCodeAt(0)));
  const decodedText = decoder.decode(bytes);
  return decodedText;
}

export function formatDateToString(date) {
  if (date === null) {
    return null
  }
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');  // Month is 0-indexed
  let day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatMoney(amount) {
  return new Intl.NumberFormat('en-US').format(amount);
}

export function formatStringDate(datetime) {
  if (datetime === null || datetime === "" || datetime === undefined) {
    return "";
  }
  const dateOnly = datetime.split('T')[0];
  return dateOnly
}

export function formatStringDateTime(datetime) {
  if (!datetime) {
    return "";
  }
  const parsed = new Date(datetime);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return formatDateTime(parsed);
}

export function formatDateTime(date) {
  const pad = (n) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // months start from 0
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
