const pad = (n) => String(n).padStart(2, "0");

export function formatMoney(value) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatRange(startAt, endAt) {
  return `${formatTime(startAt)} - ${formatTime(endAt)}`;
}

// "YYYY-MM-DD" in the viewer's local time, the format <input type="date"> uses.
export function toDateInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}
