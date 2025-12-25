import { useState } from 'react';
import { useEffect } from 'react';
import type { Log } from '@/features/types/log';
import { CalendarType } from '@/features/types/calendar';
import { loadLogs, saveLogs } from '@/lib/storage';
import type { CalendarEvent } from '@/features/types/event';
import { v4 as uuid } from 'uuid';

export const useCalendar = () => {
// 状態管理
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeCalendarId, setActiveCalendarId] = useState<CalendarType>('default');
  const [initialized, setInitialized] = useState(false);
  
  /* 入力フォーム */
  const [title, setTitle] = useState("");
  const [isAllDay, setIsAllDay] = useState<boolean>(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weight, setWeight] = useState<number | null>(null);
  const [reps, setReps] = useState<number | null>(null);
  const [sets, setSets] = useState<number | null>(null);
  const [memo, setMemo] = useState("");

  // 初回ロード時にローカルストレージから読み込み
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

  return {
    // 全体の状態管理
    isOpen,
    setIsOpen,
    selectedDate,
    selectedLog,
    activeCalendarId,
    setActiveCalendarId,
    events,
    // フォームの状態
    title, setTitle,
    memo, setMemo,
    isAllDay, setIsAllDay,
    startDate, setStartDate,
    endDate, setEndDate,
    weight, setWeight,
    reps, setReps,
    sets, setSets,
    // アクション
    startCreateLog,
    startEditLog,
    applySave,
    deleteLog,
  };
};

  