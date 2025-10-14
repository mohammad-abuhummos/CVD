import { useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarIcon,
    ClockIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";

interface DateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
}

export function DateTimePicker({ value, onChange, label, placeholder }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hours, setHours] = useState(value ? new Date(value).getHours() : 12);
    const [minutes, setMinutes] = useState(value ? new Date(value).getMinutes() : 0);
    const [isPM, setIsPM] = useState(value ? new Date(value).getHours() >= 12 : false);

    useEffect(() => {
        if (selectedDate) {
            const adjustedHours = isPM ? (hours === 12 ? 12 : hours + 12) : (hours === 12 ? 0 : hours);
            const newDate = new Date(selectedDate);
            newDate.setHours(adjustedHours, minutes);
            onChange(newDate.toISOString().slice(0, 16));
        }
    }, [selectedDate, hours, minutes, isPM]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (number | null)[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const selectDay = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            day === selectedDate.getDate() &&
            currentMonth.getMonth() === selectedDate.getMonth() &&
            currentMonth.getFullYear() === selectedDate.getFullYear()
        );
    };

    const formatDisplayValue = () => {
        if (!selectedDate) return placeholder || "Select date and time";
        const displayHours = hours === 0 ? 12 : hours;
        const minutesStr = minutes.toString().padStart(2, '0');
        const period = isPM ? 'PM' : 'AM';
        return `${selectedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })} at ${displayHours}:${minutesStr} ${period}`;
    };

    const days = getDaysInMonth(currentMonth);
    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-gray-300 hover:border-blue-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-800 text-left">
                            <div className="flex items-center space-x-3">
                                <CalendarIcon className="w-5 h-5 text-gray-400" />
                                <span className={selectedDate ? "text-gray-800" : "text-gray-400"}>
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
                            <Popover.Panel className="absolute left-0 right-0 z-[100] mt-2 w-full min-w-[320px] max-w-sm">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                                >
                                    {/* Calendar Section */}
                                    <div className="p-4">
                                        {/* Month Navigation */}
                                        <div className="flex items-center justify-between mb-4">
                                            <button
                                                onClick={prevMonth}
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                                            </button>
                                            <h3 className="text-sm font-semibold text-gray-800">{monthYear}</h3>
                                            <button
                                                onClick={nextMonth}
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                                            </button>
                                        </div>

                                        {/* Day Labels */}
                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar Days */}
                                        <div className="grid grid-cols-7 gap-1">
                                            <AnimatePresence mode="wait">
                                                {days.map((day, index) => (
                                                    <motion.div
                                                        key={`${currentMonth.getMonth()}-${index}`}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ delay: index * 0.01 }}
                                                    >
                                                        {day ? (
                                                            <button
                                                                onClick={() => selectDay(day)}
                                                                className={`
                                                                    w-full aspect-square rounded-lg text-sm font-medium transition-all
                                                                    ${isSelected(day)
                                                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                                                                        : isToday(day)
                                                                            ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                                                                            : 'hover:bg-gray-100 text-gray-700'
                                                                    }
                                                                `}
                                                            >
                                                                {day}
                                                            </button>
                                                        ) : (
                                                            <div className="w-full aspect-square" />
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Time Selection */}
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <ClockIcon className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">Time</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-3">
                                            {/* Hours */}
                                            <div className="flex flex-col items-center">
                                                <button
                                                    onClick={() => setHours((h) => (h === 12 ? 1 : h + 1))}
                                                    className="p-1 rounded-lg hover:bg-white transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </button>
                                                <div className="bg-white rounded-xl px-4 py-3 min-w-[60px] text-center border border-gray-200 shadow-sm">
                                                    <span className="text-2xl font-bold text-gray-800">{hours.toString().padStart(2, '0')}</span>
                                                </div>
                                                <button
                                                    onClick={() => setHours((h) => (h === 1 ? 12 : h - 1))}
                                                    className="p-1 rounded-lg hover:bg-white transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <span className="text-2xl font-bold text-gray-400 pt-6">:</span>

                                            {/* Minutes */}
                                            <div className="flex flex-col items-center">
                                                <button
                                                    onClick={() => setMinutes((m) => (m === 59 ? 0 : m + 1))}
                                                    className="p-1 rounded-lg hover:bg-white transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </button>
                                                <div className="bg-white rounded-xl px-4 py-3 min-w-[60px] text-center border border-gray-200 shadow-sm">
                                                    <span className="text-2xl font-bold text-gray-800">{minutes.toString().padStart(2, '0')}</span>
                                                </div>
                                                <button
                                                    onClick={() => setMinutes((m) => (m === 0 ? 59 : m - 1))}
                                                    className="p-1 rounded-lg hover:bg-white transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* AM/PM Toggle */}
                                            <div className="flex flex-col space-y-1 pt-6">
                                                <button
                                                    onClick={() => setIsPM(false)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${!isPM
                                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                                        }`}
                                                >
                                                    AM
                                                </button>
                                                <button
                                                    onClick={() => setIsPM(true)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isPM
                                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                                        }`}
                                                >
                                                    PM
                                                </button>
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

