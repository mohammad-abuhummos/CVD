import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarIcon,
    ClockIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";

interface DateTimeRangePickerProps {
    fromValue: string;
    toValue: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
}

type QuickOption = {
    label: string;
    getValue: () => { from: Date; to: Date };
};

const QUICK_OPTIONS: QuickOption[] = [
    {
        label: "Last Hour",
        getValue: () => {
            const to = new Date();
            const from = new Date(to.getTime() - 60 * 60 * 1000);
            return { from, to };
        },
    },
    {
        label: "Last 6 Hours",
        getValue: () => {
            const to = new Date();
            const from = new Date(to.getTime() - 6 * 60 * 60 * 1000);
            return { from, to };
        },
    },
    {
        label: "Last 24 Hours",
        getValue: () => {
            const to = new Date();
            const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
            return { from, to };
        },
    },
    {
        label: "Last 7 Days",
        getValue: () => {
            const to = new Date();
            const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
            return { from, to };
        },
    },
    {
        label: "Today",
        getValue: () => {
            const to = new Date();
            const from = new Date();
            from.setHours(0, 0, 0, 0);
            return { from, to };
        },
    },
    {
        label: "Yesterday",
        getValue: () => {
            const to = new Date();
            to.setDate(to.getDate() - 1);
            to.setHours(23, 59, 59, 999);
            const from = new Date(to);
            from.setHours(0, 0, 0, 0);
            return { from, to };
        },
    },
];

export function DateTimeRangePicker({
    fromValue,
    toValue,
    onFromChange,
    onToChange
}: DateTimeRangePickerProps) {
    const [focusedInput, setFocusedInput] = useState<"from" | "to">("from");
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const fromDate = fromValue ? new Date(fromValue) : null;
    const toDate = toValue ? new Date(toValue) : null;

    const applyQuickOption = (option: QuickOption, close: () => void) => {
        const { from, to } = option.getValue();
        onFromChange(from.toISOString().slice(0, 16));
        onToChange(to.toISOString().slice(0, 16));
        close();
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (number | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const selectDay = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        if (focusedInput === "from") {
            newDate.setHours(9, 0, 0, 0);
            onFromChange(newDate.toISOString().slice(0, 16));
            setFocusedInput("to");
        } else {
            newDate.setHours(17, 0, 0, 0);
            onToChange(newDate.toISOString().slice(0, 16));
        }
    };

    const isInRange = (day: number) => {
        if (!fromDate || !toDate) return false;
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return currentDate >= fromDate && currentDate <= toDate;
    };

    const isSelected = (day: number) => {
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const fromMatch = fromDate &&
            day === fromDate.getDate() &&
            currentMonth.getMonth() === fromDate.getMonth() &&
            currentMonth.getFullYear() === fromDate.getFullYear();
        const toMatch = toDate &&
            day === toDate.getDate() &&
            currentMonth.getMonth() === toDate.getMonth() &&
            currentMonth.getFullYear() === toDate.getFullYear();
        return fromMatch || toMatch;
    };

    const formatDisplayValue = () => {
        if (!fromDate || !toDate) return "Select date and time range";

        const fromStr = fromDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
        const toStr = toDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });

        return `${fromStr} → ${toStr}`;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const days = getDaysInMonth(currentMonth);
    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Time Range</label>
            <Popover className="relative">
                {({ open, close }) => (
                    <>
                        <Popover.Button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-gray-300 hover:border-blue-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-left">
                            <div className="flex items-center space-x-3">
                                <CalendarIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <span className={fromDate && toDate ? "text-gray-800 text-sm" : "text-gray-400 text-sm"}>
                                    {formatDisplayValue()}
                                </span>
                            </div>
                            <motion.div
                                animate={{ rotate: open ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </motion.div>
                        </Popover.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute left-0 z-[100] mt-2 w-[420px]">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                                >
                                    {/* Quick Options Bar */}
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 border-b border-gray-200">
                                        <div className="flex flex-wrap gap-1.5">
                                            {QUICK_OPTIONS.map((option, index) => (
                                                <motion.button
                                                    key={option.label}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => applyQuickOption(option, close)}
                                                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 text-gray-700 hover:text-white border border-gray-200 hover:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    {option.label}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        {/* From/To Toggle */}
                                        <div className="mb-3 flex items-center justify-between text-xs">
                                            <button
                                                onClick={() => setFocusedInput("from")}
                                                className={`flex-1 px-3 py-1.5 rounded-lg font-medium transition-all ${focusedInput === "from"
                                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center space-x-1">
                                                    <span>From:</span>
                                                    <span className="font-semibold">
                                                        {fromDate ? fromDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Select"}
                                                    </span>
                                                </div>
                                            </button>
                                            <span className="mx-2 text-gray-400">→</span>
                                            <button
                                                onClick={() => setFocusedInput("to")}
                                                className={`flex-1 px-3 py-1.5 rounded-lg font-medium transition-all ${focusedInput === "to"
                                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center space-x-1">
                                                    <span>To:</span>
                                                    <span className="font-semibold">
                                                        {toDate ? toDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Select"}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Month Navigation */}
                                        <div className="flex items-center justify-between mb-3">
                                            <button
                                                onClick={prevMonth}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <h3 className="text-xs font-semibold text-gray-800">{monthYear}</h3>
                                            <button
                                                onClick={nextMonth}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>

                                        {/* Day Labels */}
                                        <div className="grid grid-cols-7 gap-1 mb-1">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                                <div key={i} className="text-center text-[10px] font-medium text-gray-400 py-1">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar Days */}
                                        <div className="grid grid-cols-7 gap-1 mb-3">
                                            {days.map((day, index) => (
                                                <div key={index}>
                                                    {day ? (
                                                        <button
                                                            onClick={() => selectDay(day)}
                                                            className={`
                                                                w-full aspect-square rounded-lg text-xs font-medium transition-all
                                                                ${isSelected(day)
                                                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md scale-105 ring-2 ring-blue-200'
                                                                    : isInRange(day)
                                                                        ? 'bg-blue-100 text-blue-700'
                                                                        : 'hover:bg-gray-100 text-gray-700'
                                                                }
                                                            `}
                                                        >
                                                            {day}
                                                        </button>
                                                    ) : (
                                                        <div className="w-full aspect-square" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Time Inputs */}
                                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 flex items-center">
                                                    <ClockIcon className="w-3 h-3 mr-1" />
                                                    Start Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={fromDate ? fromDate.toTimeString().slice(0, 5) : "09:00"}
                                                    onChange={(e) => {
                                                        if (fromDate) {
                                                            const [hours, minutes] = e.target.value.split(':');
                                                            const newDate = new Date(fromDate);
                                                            newDate.setHours(parseInt(hours), parseInt(minutes));
                                                            onFromChange(newDate.toISOString().slice(0, 16));
                                                        }
                                                    }}
                                                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 flex items-center">
                                                    <ClockIcon className="w-3 h-3 mr-1" />
                                                    End Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={toDate ? toDate.toTimeString().slice(0, 5) : "17:00"}
                                                    onChange={(e) => {
                                                        if (toDate) {
                                                            const [hours, minutes] = e.target.value.split(':');
                                                            const newDate = new Date(toDate);
                                                            newDate.setHours(parseInt(hours), parseInt(minutes));
                                                            onToChange(newDate.toISOString().slice(0, 16));
                                                        }
                                                    }}
                                                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
}
