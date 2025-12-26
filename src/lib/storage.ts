import type { Log } from "@/features/calendar/types/log";

const STRAGE_KEY = 'dayfolio-logs';

export function loadLogs(): Log[] {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(STRAGE_KEY);
  if (!raw) return [];

  const parsed = JSON.parse(raw);

  return parsed.map((log: any) => {
    if (log.calendarId === 'default') {
      return {
        ...log,
        start: new Date(log.start),
        end: new Date(log.end),
      };
    }

    // workout, study
    return {
      ...log,
      date: new Date(log.date),
    };
  });
}

export function saveLogs(logs: Log[]){
  localStorage.setItem(STRAGE_KEY, JSON.stringify(logs));
}