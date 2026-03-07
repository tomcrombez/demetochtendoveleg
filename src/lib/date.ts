const BRUSSELS_TZ = 'Europe/Brussels';

export function formatBoardDate(date: string) {
  return new Intl.DateTimeFormat('nl-BE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: BRUSSELS_TZ,
  }).format(new Date(`${date}T12:00:00`));
}

export function formatDayName(date: string) {
  return new Intl.DateTimeFormat('nl-BE', {
    weekday: 'long',
    timeZone: BRUSSELS_TZ,
  }).format(new Date(`${date}T12:00:00`));
}
