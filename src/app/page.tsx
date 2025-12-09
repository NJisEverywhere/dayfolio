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

const locales = {
  ja: ja,
};

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
  const handleSelectSlot = (slotInfo: { start: Date }) => {
    console.log("slotInfo:", slotInfo);
    setSelectedDate(slotInfo.start);
    setIsOpen(true);
  };
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState<number | null>(null);
  const [reps, setReps] = useState<number | null>(null);
  const [sets, setSets] = useState<number | null>(null);
  const [memo, setMemo] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);


  const resetForm = () => {
    setTitle("");
    setWeight(null);
    setReps(null);
    setSets(null);
    setMemo("");
  };

  const saveLog=() => {
    if (!selectedDate) return;

    const newLog: Log = {
      date: selectedDate,
      title,
      weight,
      reps,
      sets,
      memo,
    };
    setLogs((prev) => [...prev, newLog]);
    setIsOpen(false);
    resetForm();
  };



  console.log("isOpen:", isOpen);

  return (
    <>
      <div style={{ height: "100vh", padding: 16 }}>
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          selectable={true}
          locale="ja"
          longPressThreshold={1}
          onSelectSlot={handleSelectSlot}
        />
      </div>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9998,
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
            zIndex: 999999,
            }}
          >

            <Dialog.Title
              style={{ margin: 0, fontWeight: "bold", fontSize: 18 }}
            >
              {selectedDate
                ? selectedDate.toLocaleDateString("ja-JP")
                : "日付が選択されていません"}
            </Dialog.Title>

            <label>種目名</label>
            <input
              type="text"
              value={title}
              style={{ width: "100%", marginTop: 5, marginBottom: 15 }}
              onChange={(e)=>setTitle(e.target.value)}
            />

            <label>重量(kg)</label>
            <input
              type="number"
              value={weight ?? ""}
              onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : null)}
              style={{ width: "100%", marginTop: 5, marginBottom: 15 }}
            />

            <label>レップ数</label>
            <input
              type="number"
              value={reps ?? ""}
              onChange={(e) => setReps(e.target.value ? parseInt(e.target.value) : null)}
              style={{ width: "100%", marginTop: 5, marginBottom: 15 }}
            />

            <label>セット数</label>
            <input
              type="number"
              value={sets ?? ""}
              onChange={(e) => setSets(e.target.value ? parseInt(e.target.value) : null)}
              style={{ width: "100%", marginTop: 5, marginBottom: 15 }}
            />

            <label>メモ</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              style={{ width: "100%", marginTop: 5, marginBottom: 15 }}
            />

            <button onClick={saveLog}>保存</button>

            <Dialog.Close
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                cursor: "pointer",
                background: "none",
                border: "none",
                fontSize: 16,
              }}
            >
              ×
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
