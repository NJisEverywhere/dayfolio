"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { ja } from "date-fns/locale";


const locales = {
  "ja": ja,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Home() {
  return (
    <div>
      <Calendar
        localizer={localizer}  
        events={[]}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        selectable
        locale="ja"
      />
    </div>
  );
}
