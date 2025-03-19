export function formatDate(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();

  const days = date.getDate();
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const isToday = date.toDateString() === now.toDateString();
  const isCurrentYear = year === now.getFullYear();

  if (isToday) {
    return `${days} ${month}, ${hours}:${minutes}`;
  }

  return isCurrentYear ? `${days} ${month}` : `${days} ${month} ${year}`;
}

export function getCorrectForm(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} штука`;
  } else if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return `${count} штуки`;
  } else {
    return `${count} штук`;
  }
}
