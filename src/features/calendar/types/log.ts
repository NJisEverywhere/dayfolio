import { CalendarType } from './calendar';

type DefaultLog = {
  calendarId: 'default';
  start: Date;
  end: Date;
  isAllDay: boolean;
};

type WorkoutLog = {
  calendarId: 'workout';
  date: Date;
  weight: number | null;
  reps: number | null;
  sets: number | null;
};

type StudyLog = {
  calendarId: 'study';
  date: Date;
};

export type Log = {
  // 共通
  id: string;
  calendarId: CalendarType;
  title: string;
  memo: string;
} & (DefaultLog | WorkoutLog | StudyLog);


  

