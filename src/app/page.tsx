"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { v4 as uuid } from "uuid";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ja } from "date-fns/locale";
import { use, useEffect, useState } from "react";
import LogModal from "@/components/log/logModal";
import type { Log } from "@/features/types/log";
import { CalendarType } from "@/features/types/calendar";
import type { UserCalendar } from "@/features/types/calendar";
import type { CalendarEvent } from "@/features/types/event";
import { loadLogs, saveLogs } from "@/lib/storage";


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
  
  const Calendars: UserCalendar[] = [
    { id: 'default', name: '予定管理', type: 'default' },
    { id: 'workout', name: '筋トレ', type: 'workout' },
    { id: 'study', name: '学習', type: 'study' },
  ];

  return (
    <>
      {/* カレンダー本体 */}
      <div style={{ height: "100vh", padding: 16 }}> 
        <div style={{ marginBottom: 16 }}>
          <select
            value={activeCalendarId}
            onChange={(e) =>
              setActiveCalendarId(e.target.value as CalendarType)
            }
          >
            {Calendars.map((cal) => (
              <option key={cal.id} value={cal.type}>
                {cal.name}
              </option>
            ))}
          </select>   
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          selectable
          onSelectSlot={(slot) => startCreateLog(slot.start)}
          onSelectEvent={(event: CalendarEvent) => startEditLog(event.log)}
        />
      </div>

      <LogModal

        open={isOpen}
        onOpenChange={setIsOpen}
        activeCalendarId={activeCalendarId}
        selectedDate={selectedDate}
        selectedLog={selectedLog}
        title={title}
        setTitle={setTitle}
        memo={memo}
        setMemo={setMemo}
        isAllDay={isAllDay}
        setIsAllDay={setIsAllDay}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        weight={weight}
        setWeight={setWeight}
        reps={reps}
        setReps={setReps}
        sets={sets}
        setSets={setSets}
        applySave={applySave}
        deleteLog={deleteLog}
      />
      
    </>
  );
}
