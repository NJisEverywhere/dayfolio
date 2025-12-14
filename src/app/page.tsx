"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { v4 as uuid } from "uuid";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { ja } from "date-fns/locale";
import Input from "@/app/components/UI/Input";
import Button from "@/app/components/UI/Button";
import TextArea from "@/app/components/UI/TextArea";

import { use, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

/* ---------------------------
    // 型定義
---------------------------- */
type Log = {
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

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  log: Log;
};

type CalendarType = 'default' | 'workout' | 'study';

type UserCalendar = {
  id: string;
  name: string;
  type: CalendarType;
};

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

  useEffect(() => {
    const storedLogs = localStorage.getItem("dayfolio-workout-logs");
    if (!storedLogs) return;

    const parsedLogs = JSON.parse(storedLogs);

    const logsWithDate = parsedLogs.map((log: any) => {
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

    setLogs(logsWithDate);
  }, []);

  // logsの更新時に自動保存する
  useEffect(() => {
    localStorage.setItem("dayfolio-workout-logs", JSON.stringify(logs));
  }, [logs]);

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

    const baseDate = log.calendarId === 'default' ? log.start! : log.date!;

    setSelectedDate(baseDate);

    setTitle(log.title);
    setMemo(log.memo);

    if (log.calendarId === 'default') {
      const checkAllDay = log.isAllDay ?? false;
      setIsAllDay(checkAllDay);

      const iso = log.start!.toISOString();

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

  if (activeCalendarId === 'default') {
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

  else if (activeCalendarId === 'workout') {
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

  else if (activeCalendarId === 'study') {
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
  const events = logs
    .filter(log => log.calendarId === activeCalendarId)
    .map((log) => {
      if (log.calendarId === 'default') {
        return {
          title: log.title,
          start: log.start!,
          end: log.end!,
          log,
        };
      }

      return {
        title: log.title,
        start: log.date!,
        end: log.date!,
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

      {/* モーダル */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className='fixed inset-0 bg-black/50'
          />
          <Dialog.Content
            className='
              fixed left-1/2 top-1/2
              w-[90%] max-w-md
              -translate-x-1/2 -translate-y-1/2
              rounded-xl bg-white shadow-lg
              p-6
              flex flex-col gap-6
              z-50
            '
          >
            <Dialog.Title className='text-lg font-semibold'>
              {selectedDate?.toLocaleDateString("ja-JP")}
            </Dialog.Title>

            {activeCalendarId === 'default' && (
              <div className='space-y-1'>
                <label className='text-sm text-gray-600'>タイトル</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                  />
                  終日
                </label>

                <label>開始</label>
                <input
                  type={isAllDay ? "date" : "datetime-local"}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <label>終了</label>
                <input
                  type={isAllDay ? "date" : "datetime-local"}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />    
              </div>
            )}

            {activeCalendarId === 'workout' && (
              <div className="space-y-1">
                <label>種目名</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>重量</label>
                <Input
                  type="number"
                  value={weight ?? ""}
                  onChange={(e) =>
                    setWeight(e.target.value ? Number(e.target.value) : null)
                 }
               />

                <label>レップ</label>
                <Input
                  type="number"
                  value={reps ?? ""}
                  onChange={(e) =>
                    setReps(e.target.value ? Number(e.target.value) : null)
                  }
               />

                <label>セット</label>
                <Input
                  type="number"
                  value={sets ?? ""}
                  onChange={(e) =>
                    setSets(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>
            )}

            {activeCalendarId === 'study' && (
              <div className="space-y-1">
                <label>学習内容</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            )}
            

            <label>メモ</label>
            <TextArea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            ></TextArea>

            <Button onClick={applySave}>
              {selectedLog ? "更新" : "保存"}
            </Button>
            {selectedLog && (
              <Button onClick={deleteLog} style={{ color: "red" }}>
                削除
              </Button>
            )}

            <Dialog.Close className='absolute right-4 top-4 text-gray-400 hover:text-gray-600'>
              ×
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
