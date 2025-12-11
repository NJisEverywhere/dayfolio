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
  date: Date;
  title: string;
  weight: number | null;
  reps: number | null;
  sets: number | null;
  memo: string;
  id?: string;
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

  useEffect(() => {
    // ローカルストレージからログを読み込み
    const storedLogs = localStorage.getItem("dayfolio-workout-logs");
    if (storedLogs) {
      const parsedLogs= JSON.parse(storedLogs);
      // 日付文字列をDateオブジェクトに変換
      const logsWithDate = parsedLogs.map((log: any) => ({
        ...log,
        date: new Date(log.date),
      }));
      setLogs(logsWithDate);
    }
  }, []);

  useEffect(() => {
    // ログが更新されるたびにローカルストレージに保存
    localStorage.setItem("dayfolio-workout-logs", JSON.stringify(logs));
  }, [logs]);

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

  if (selectedLog) {
    // 更新
    const updatedLogs = logs.map((log) =>
      log.id === selectedLog.id
        ? {
            ...log,
            date: selectedDate,
            title,
            weight,
            reps,
            sets,
            memo,
          }
        : log
    );

    setLogs(updatedLogs);
  } else {
    // 新規追加
    const newLog: Log = {
      id: uuid(),
      date: selectedDate,
      title,
      weight,
      reps,
      sets,
      memo,
    };

    setLogs([...logs, newLog]);
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
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              zIndex: 10000,
              boxSizing: "border-box",
            }}
          >
            <Dialog.Title style={{ fontWeight: "bold", marginBottom: 10 }}>
              {selectedDate?.toLocaleDateString("ja-JP")}
            </Dialog.Title>

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

            <Dialog.Close style={{ position: "absolute", top: 10, right: 10 }}>
              ×
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
