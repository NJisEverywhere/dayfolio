import { CalendarType } from './calendar';

export type Log = {
  // 共通
  id: string;
  calendarId: CalendarType;
  title: string;
  memo: string;

  // default
  start?: Date;
  end?: Date;
  isAllDay?: boolean;
  
  // workout
  date?: Date;
  weight?: number|null;
  reps?: number|null;
  sets?: number|null;
};


  

