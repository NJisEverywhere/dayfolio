"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { v4 as uuid } from "uuid";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { ja } from "date-fns/locale";

import { use, useEffect, useState } from "react";
import LogModal from "@/components/UI/logModal";
import type { Log, CalendarType } from "@/types/log";
import type { UserCalendar } from "@/types/calendar";
import type { CalendarEvent } from "@/types/event";
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeCalendarId, setActiveCalendarId] = useState<CalendarType>('default');
  const [isAllDay, setIsAllDay] = useState<boolean>(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const Calendars: UserCalendar[] = [
    { id: 'default', name: '予定管理', type: 'default' },
    { id: 'workout', name: '筋トレ', type: 'workout' },
    { id: 'study', name: '学習', type: 'study' },
  ];

  /* 入力フォーム */
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState<number | null>(null);
  const [reps, setReps] = useState<number | null>(null);
  const [sets, setSets] = useState<number | null>(null);
  const [memo, setMemo] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loaded = loadLogs();
    setLogs(loaded);
    setInitialized(true);
  }, []);

  // logsの更新時に自動保存する
  useEffect(() => {
    if (!initialized) return;
    saveLogs(logs);
  }, [logs, initialized]);

  /* ---------------------------
      フォームリセット
  ---------------------------- */
  const resetForm = () => {
    setTitle("");
    setWeight(null);
    setReps(null);
    setSets(null);
    setMemo("");
    setIsAllDay(true);
    setStartDate("");
    setEndDate("");
  };

  /* ---------------------------
      新規作成モードを開始
  ---------------------------- */
  const startCreateLog = (date: Date) => {
    setSelectedLog(null);
    setSelectedDate(date);
    resetForm();
    setIsOpen(true);
  };

  /* ---------------------------
      編集モードを開始
  ---------------------------- */
  const startEditLog = (log: Log) => {
    setSelectedLog(log);

    const baseDate = log.calendarId === 'default' ? log.start : log.date;

    setSelectedDate(baseDate);

    setTitle(log.title);
    setMemo(log.memo);

    if (log.calendarId === 'default') {
      const checkAllDay = log.isAllDay ?? false;
      setIsAllDay(checkAllDay);

      const iso = log.start.toISOString();

      if (checkAllDay) {
        setStartDate(iso.slice(0, 10));
        setEndDate(iso.slice(0, 10));
      } else {
        setStartDate(iso.slice(0, 16));
        setEndDate(iso.slice(0, 16));
      }
    }

    if (log.calendarId === 'workout') {
      setWeight(log.weight ?? null);
      setReps(log.reps ?? null);
      setSets(log.sets ?? null);
    }

    setIsOpen(true);
  };

  /* ---------------------------
      保存処理（新規 or 編集）
  ---------------------------- */
  const applySave = () => {
  if (!selectedDate) return;

  const targetCalendarId = selectedLog ? selectedLog.calendarId : activeCalendarId;

  if (targetCalendarId === 'default') {
    if (!startDate || !endDate) {
      alert("開始日と終了日を入力してください");
      return;
    }

    const start = new Date(startDate);
    const end = isAllDay ? new Date(endDate) : new Date(endDate);

    if (selectedLog) {
      setLogs(logs.map((log) =>
        log.id === selectedLog.id
          ? { ...log, title, start, end, isAllDay, memo }
          : log
      ));
    } else {
      setLogs([...logs, {
        id: uuid(),
        calendarId: 'default',
        title,
        start,
        end,
        isAllDay,
        memo,
      }]);
    }
  }

  else if (targetCalendarId === 'workout') {
    const date = selectedDate;

    if(selectedLog) {
      setLogs(logs.map((log) =>
        log.id === selectedLog.id
          ? { ...log, date, title, weight, reps, sets, memo }
          : log
      ));
    } else {
      setLogs([...logs, {
        id: uuid(),
        calendarId: 'workout',
        date,
        title,
        weight,
        reps,
        sets,
        memo,
      }]);
    }
  }

  else if (targetCalendarId === 'study') {
    const date = selectedDate;

    if(selectedLog) {
      setLogs(logs.map((log) =>
        log.id === selectedLog.id
          ? { ...log, date, title, memo }
          : log
      ));
    } else {
      setLogs([...logs, {
        id: uuid(),
        calendarId: 'study',
        date,
        title,
        memo,
      }]);
    }
  }

  resetForm();
  setSelectedLog(null);
  setIsOpen(false);
};


  // 削除機能
  const deleteLog = () => {
    if (!selectedLog) return;
    
    setLogs(logs.filter((log) => log.id !== selectedLog.id) );

    setSelectedLog(null);
    resetForm();
    setIsOpen(false);
  };
  /* ---------------------------
      カレンダーに渡すイベント
  ---------------------------- */
  const events: CalendarEvent[] = logs
    .filter(log => log.calendarId === activeCalendarId)
    .map((log) => {
      if (log.calendarId === 'default') {
        return {
          title: log.title,
          start: log.start,
          end: log.end,
          log,
        };
      }

      return {
        title: log.title,
        start: log.date,
        end: log.date,
        log,
      };
  });

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
