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

const locales = { ja };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState<number | null>(null);
  const [reps, setReps] = useState<number | null>(null);
  const [sets, setSets] = useState<number | null>(null);
  const [memo, setMemo] = useState("");

  const [logs, setLogs] = useState<Log[]>([]);

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setSelectedLog(null);
    setSelectedDate(slotInfo.start);
    resetForm();
    setIsOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setWeight(null);
    setReps(null);
    setSets(null);
    setMemo("");
  };

  const saveLog = () => {
    if (!selectedDate) return;

    const logData: Log = {
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
        prev.map((log) => (log === selectedLog ? logData : log))
      );
    } else {
      // 新規
      setLogs((prev) => [...prev, logData]);
    }

    setSelectedLog(null);
    setIsOpen(false);
    resetForm();
  };

  const events = logs.map((log) => ({
    title: log.title,
    start: new Date(log.date),
    end: new Date(log.date),
    log,
  }));

  return (
    <>
      <div style={{ height: "100vh", padding: 16 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          selectable
          locale="ja"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event: CalendarEvent) => {
            setSelectedLog(event.log);
            setSelectedDate(event.log.date);
            setTitle(event.log.title);
            setWeight(event.log.weight);
            setReps(event.log.reps);
            setSets(event.log.sets);
            setMemo(event.log.memo ?? "");
            setIsOpen(true);
          }}
        />
      </div>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
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
            <Dialog.Title style={{ fontWeight: "bold", fontSize: 18 }}>
              {selectedDate?.toLocaleDateString("ja-JP")}
            </Dialog.Title>

            <label>種目名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>重量(kg)</label>
            <input
              type="number"
              value={weight ?? ""}
              onChange={(e) =>
                setWeight(e.target.value ? Number(e.target.value) : null)
              }
            />

            <label>レップ数</label>
            <input
              type="number"
              value={reps ?? ""}
              onChange={(e) =>
                setReps(e.target.value ? Number(e.target.value) : null)
              }
            />

            <label>セット数</label>
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
            />

            <button onClick={saveLog}>
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
