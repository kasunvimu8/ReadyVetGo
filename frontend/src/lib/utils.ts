import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function formatDateTime(date: Date) {
  const d = new Date(date)
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hour = "" + d.getHours(),
    minute = "" + d.getMinutes(),
    second = "" + d.getSeconds()

  month = month.length < 2 ? "0" + month : month
  day = day.length < 2 ? "0" + day : day
  hour = hour.length < 2 ? "0" + hour : hour
  minute = minute.length < 2 ? "0" + minute : minute
  second = second.length < 2 ? "0" + second : second

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export const dateToTimeDeltaString = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diff / (1000 * 60));
  const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (diffInDays === 0) {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return date.toLocaleString('en-US', { weekday: 'short' });
  } else {
    return 'Last week';
  }
}

export function isMongoId(str?: string) {
  return str != null && str.length === 24 && /^[A-F0-9]+$/i.test(str)
}
