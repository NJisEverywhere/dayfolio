"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ja } from "date-fns/locale";
import LogModal from "@/features/calendar/components/logModal";
import { CalendarType } from "@/features/calendar/types/calendar";
import type { UserCalendar } from "@/features/calendar/types/calendar";
import type { CalendarEvent } from "@/features/calendar/types/event";
import { useCalendar } from "@/features/calendar/hooks/useCalendar";

/* ---------------------------
  カレンダーのロケール設定
---------------------------- */
const locales = { ja };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/* ---------------------------
  メインコンポーネント
---------------------------- */
export default function Home() {
  /* カレンダー用のフック */
  const calendar = useCalendar();
  
  const Calendars: UserCalendar[] = [
    { id: 'default', name: '予定管理', type: 'default' },
    { id: 'workout', name: '筋トレ', type: 'workout' },
    { id: 'study', name: '学習', type: 'study' },
  ];

  return (
    <>
      {/* カレンダー切り替えのセレクトボックス */}
      <main style={{ height: "100vh", padding: 16 }}> 
        <div style={{ marginBottom: 16 }}>
          <select
            value={calendar.activeCalendarId}
            onChange={(e) =>
              calendar.setActiveCalendarId(e.target.value as CalendarType)
            }
          >
            {Calendars.map((cal) => (
              <option key={cal.id} value={cal.type}>
                {cal.name}
              </option>
            ))}
          </select>   
        </div>

        {/* カレンダー本体 */}
        <div style={{height: 'calc(100% - 60px)'}}>
          <Calendar
            localizer={localizer}
            events={calendar.events}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            selectable
            onSelectSlot={(slot) => calendar.startCreateLog(slot.start)}
            onSelectEvent={(event: CalendarEvent) => calendar.startEditLog(event.log)}
          />
        </div> 
        {/* ログ入力モーダル */}
        <LogModal 
          {...calendar}
          open={calendar.isOpen}
          onOpenChange={calendar.setIsOpen}
          />      
      </main>

    </>
  );
}
