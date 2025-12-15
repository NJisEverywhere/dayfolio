
import { Log } from './log';

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  log: Log;
};