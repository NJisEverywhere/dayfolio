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

const [isOpen, setIsOpen] = useState(false);
const [selectedDate, setSelectedDate] = useState<Date | null>(null);

const handleSelectSlot = (slotInfo: { start: Date }) => {
  setSelectedDate(slotInfo.start);
  setIsOpen(true);
};

  return (
    <div style={{ height: "100vh", padding: 16 }}>
      <Calendar
        localizer={localizer}  
        events={[]}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        selectable
        locale="ja"
      />

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
              margin: "20vh auto",
              position: "relative",
            }}
          >
            <Dialog.Title style={{ margin: 0, fontWeight: "bold", fontSize: 18 }}>
              選択した日
            </Dialog.Title>

            <p style={{ marginTop: 10 }}>
              {selectedDate ? selectedDate.toLocaleDateString("ja-JP") : "日付が選択されていません"}
            </p>

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
    </div>
  );
}
