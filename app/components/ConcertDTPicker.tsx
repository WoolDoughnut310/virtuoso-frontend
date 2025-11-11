import { useState } from "react";
import { format, setHours, setMinutes, isBefore, isSameDay, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";

interface TimeInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    label: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
    value,
    onChange,
    min = 0,
    max,
    label,
}) => (
    <div className="flex flex-col items-center">
        <label className="text-xs text-[#282828] mb-1 uppercase tracking-wider">
            {label}
        </label>
        <input
            type="number"
            value={value.toString().padStart(2, "0")}
            onChange={(e) => {
                const num = parseInt(e.target.value);
                if (
                    !isNaN(num) &&
                    num >= min &&
                    (max === undefined || num <= max)
                ) {
                    onChange(num);
                }
            }}
            min={min}
            max={max}
            className="w-12 h-8 text-lg text-[#282828] text-center bg-[#f2f2f2] border border-[#e0e0e0] rounded-md focus:border-[#C39F45] focus:ring-1 focus:ring-[#C39F45] focus:outline-none transition-colors duration-200"
        />
    </div>
);

export interface ConcertDateTimePickerProps {
    value: Date | undefined;
    onChange: (newDate: Date) => void;
}

export function ConcertDTPicker({
    value,
    onChange,
}: ConcertDateTimePickerProps) {
    const [open, setOpen] = useState(false);

    const date = value || new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const handleDateSelect = (newDate?: Date) => {
        if (!newDate) return;
        const updated = setMinutes(setHours(newDate, hours), minutes);
        onChange(updated);
        setOpen(false);
    };

    const handleHoursChange = (newHours: number) => {
        const updated = setHours(setMinutes(date, minutes), newHours);

        if (isSameDay(date, new Date()) && isBefore(updated, new Date())) {
            return;
        }

        onChange(updated);
    };

    const handleMinutesChange = (newMinutes: number) => {
        const updated = setMinutes(setHours(date, hours), newMinutes);

        if (isSameDay(date, new Date()) && isBefore(updated, new Date())) {
            return;
        }

        onChange(updated);
    };

    const isPastDate = (date: Date) => {
        return isBefore(startOfDay(date), startOfDay(new Date()));
    }

    const calendarDate = setMinutes(setHours(date, 0), 0);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="border-b hover:cursor-pointer border-b-[#e0e0e0] w-48 h-10 justify-center font-normal text-base bg-transparent text-[#282828] border border-transparent hover:border-[#C39F45] focus-visible:ring-2 focus-visible:ring-[#C39F45] transition-colors duration-200"
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[#C39F45]" />
                    {date ? (
                        format(date, "MMM dd, yyyy HH:mm")
                    ) : (
                        <span>Pick Date & Time</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white shadow-xl rounded-lg">
                <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={handleDateSelect}
                    autoFocus
                    disabled={isPastDate}
                    classNames={{
                        selected:
                            "bg-[#C39F45] text-white hover:bg-[#A88C3E] hover:text-white focus:bg-[#C39F45]",
                        today: "bg-amber-50 text-[#C39F45] border border-[#C39F45]",
                    }}
                />
                <div className="flex items-center justify-center space-x-4 p-3 border-t border-[#e0e0e0] bg-[#fcfcfc]">
                    <Clock className="h-4 w-4 text-[#C39F45] mt-4" />
                    <TimeInput
                        label="Hour"
                        value={hours}
                        onChange={handleHoursChange}
                        max={23}
                    />
                    <span className="text-xl text-[#282828] font-bold mt-4">
                        :
                    </span>
                    <TimeInput
                        label="Minute"
                        value={minutes}
                        onChange={handleMinutesChange}
                        max={59}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
