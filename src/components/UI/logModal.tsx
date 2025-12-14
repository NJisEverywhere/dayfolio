import * as Dialog from "@radix-ui/react-dialog";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import TextArea from "@/components/UI/TextArea";
import type { Log, CalendarType } from "@/app/page";


type LogModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  activeCalendarId: CalendarType;
  selectedDate: Date | null;
  selectedLog: Log | null;

  title: string;
  setTitle: (v: string) => void;
  memo: string;
  setMemo: (v: string) => void;

  isAllDay: boolean;
  setIsAllDay: (v: boolean) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;

  weight: number | null;
  setWeight: (v: number | null) => void;
  reps: number | null;
  setReps: (v: number | null) => void;
  sets: number | null;
  setSets: (v: number | null) => void;

  applySave: () => void;
  deleteLog: () => void;
};

export default function LogModal(props: LogModalProps) {
  const {
    open,
    onOpenChange,
    activeCalendarId,
    selectedDate,
    selectedLog,
    title,
    setTitle,
    memo,
    setMemo,
    isAllDay,
    setIsAllDay,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    weight,
    setWeight,
    reps,
    setReps,
    sets,
    setSets,
    applySave,
    deleteLog,
  } = props;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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

