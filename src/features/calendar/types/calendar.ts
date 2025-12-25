export type CalendarType = 'default' | 'workout' | 'study';

export type UserCalendar = {
  id: string;
  name: string;
  type: CalendarType;
};
