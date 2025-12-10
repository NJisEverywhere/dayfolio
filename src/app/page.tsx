"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { ja } from "date-fns/locale";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

/* ---------------------------
    // 型定義
---------------------------- */
type Log = {
  date: Date;
  title: string;
  weight: number | null;
  reps: number | null;
  sets: number | null;
  memo: string;
};

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  log: Log;
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

  /* 入力フォーム */
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState<number | null>(null);
  const [reps, setReps] = useState<number | null>(null);
  const [sets, setSets] = useState<number | null>(null);
  const [memo, setMemo] = useState("");

  /* ---------------------------
      フォームリセット
  ---------------------------- */
  const resetForm = () => {
    setTitle("");
    setWeight(null);
    setReps(null);
    setSets(null);
    setMemo("");
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
    setSelectedDate(log.date);

    // フォームに値をセット
    setTitle(log.title);
    setWeight(log.weight);
    setReps(log.reps);
    setSets(log.sets);
    setMemo(log.memo);

    setIsOpen(true);
  };

  /* ---------------------------
      保存処理（新規 or 編集）
  ---------------------------- */
  const applySave = () => {
    if (!selectedDate) return;

    const updatedLog: Log = {
      date: selectedDate,
      title,
      weight,
      reps,
      sets,
      memo,
    };

    if (selectedLog) {
      // 編集
      setLogs((prev) =>
        prev.map((log) =>
          log.date.getTime() === selectedLog.date.getTime() ? updatedLog : log
        )
      );
    } else {
      // 新規追加
      setLogs((prev) => [...prev, updatedLog]);
    }

    setSelectedLog(null);
    resetForm();
    setIsOpen(false);
  };

  /* ---------------------------
      カレンダーに渡すイベント
  ---------------------------- */
  const events = logs.map((log) => ({
    title: log.title,
    start: log.date,
    end: log.date,
    log,
  }));

  return (
    <>
      {/* カレンダー本体 */}
      <div style={{ height: "100vh", padding: 16 }}>
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
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />
          <Dialog.Content
            style={{
              background: "white",
              borderRadius: 8,
              padding: 20,
              width: "90%",
              maxWidth: 400,
              position: "fixed",
              top: "20vh",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Dialog.Title style={{ fontWeight: "bold", marginBottom: 10 }}>
              {selectedDate?.toLocaleDateString("ja-JP")}
            </Dialog.Title>

            <label>種目名</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>重量</label>
            <input
              type="number"
              value={weight ?? ""}
              onChange={(e) =>
                setWeight(e.target.value ? Number(e.target.value) : null)
              }
            />

            <label>レップ</label>
            <input
              type="number"
              value={reps ?? ""}
              onChange={(e) =>
                setReps(e.target.value ? Number(e.target.value) : null)
              }
            />

            <label>セット</label>
            <input
              type="number"
              value={sets ?? ""}
              onChange={(e) =>
                setSets(e.target.value ? Number(e.target.value) : null)
              }
            />

            <label>メモ</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            ></textarea>

            <button onClick={applySave}>
              {selectedLog ? "更新" : "保存"}
            </button>

            <Dialog.Close style={{ position: "absolute", top: 10, right: 10 }}>
              ×
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
