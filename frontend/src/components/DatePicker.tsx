// frontend/src/components/DatePicker.tsx
"use client";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

// Hàm để định dạng ngày thành chuỗi YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) { 
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate);
  }

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {dates.map((date, index) => {
        const dateString = formatDate(date);
        const isSelected = dateString === selectedDate;

        return (
          <button
            key={index}
            onClick={() => onDateChange(dateString)}
            className={`flex-shrink-0 px-4 py-2 rounded-md text-sm text-center transition-colors ${
              isSelected
                ? 'bg-sky-500 text-white font-bold'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="font-semibold">{date.toLocaleDateString('vi-VN', { weekday: 'short' })}</div>
            <div>{date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
          </button>
        );
      })}
    </div>
  );
}