import type { Route } from "./+types/logs";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

type Log = {
    id: string;
    level: "info" | "warn" | "error";
    time: string; // ISO
    message: string;
    source?: string;
};

export function meta({ }: Route.MetaArgs) {
    return [{ title: "Logs - Camera Video Downloader" }];
}

export default function LogsRoute() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [query, setQuery] = useState("");
    const [level, setLevel] = useState<"all" | Log["level"]>("all");
    const [autoRefresh, setAutoRefresh] = useState(false);

    useEffect(() => {
        // Mock logs with more detail
        const now = Date.now();
        setLogs([
            {
                id: "1",
                level: "info",
                time: new Date(now - 120000).toISOString(),
                message: "User login successful",
                source: "Authentication Service"
            },
            {
                id: "2",
                level: "info",
                time: new Date(now - 90000).toISOString(),
                message: "Video export started for camera cam-1",
                source: "Export Service"
            },
            {
                id: "3",
                level: "warn",
                time: new Date(now - 60000).toISOString(),
                message: "Transcoder queue delay detected - 5 items pending",
                source: "Transcoder Service"
            },
            {
                id: "4",
                level: "info",
                time: new Date(now - 45000).toISOString(),
                message: "Database backup completed successfully",
                source: "Database Service"
            },
            {
                id: "5",
                level: "error",
                time: new Date(now - 30000).toISOString(),
                message: "Storage write failed; retrying (attempt 1/3)",
                source: "Storage Service"
            },
            {
                id: "6",
                level: "info",
                time: new Date(now - 15000).toISOString(),
                message: "Storage write successful on retry",
                source: "Storage Service"
            },
            {
                id: "7",
                level: "info",
                time: new Date(now - 5000).toISOString(),
                message: "System health check passed",
                source: "Monitor Service"
            },
        ]);
    }, []);

    // Auto-refresh simulation
    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => {
            const newLog: Log = {
                id: `log-${Date.now()}`,
                level: "info",
                time: new Date().toISOString(),
                message: "Auto-refresh: System is operational",
                source: "Monitor Service"
            };
            setLogs(prev => [newLog, ...prev].slice(0, 20));
        }, 10000);
        return () => clearInterval(interval);
    }, [autoRefresh]);

    const filtered = useMemo(() => {
        return logs.filter((l) => {
            if (level !== "all" && l.level !== level) return false;
            if (query && !l.message.toLowerCase().includes(query.toLowerCase()) &&
                !l.source?.toLowerCase().includes(query.toLowerCase())) return false;
            return true;
        });
    }, [logs, query, level]);

    const levelCounts = useMemo(() => {
        return {
            info: logs.filter(l => l.level === "info").length,
            warn: logs.filter(l => l.level === "warn").length,
            error: logs.filter(l => l.level === "error").length,
        };
    }, [logs]);

    return (
        <main className="min-h-screen p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                            Activity Logs
                        </h1>
                        <p className="text-gray-600">Monitor system events and activities</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <ArrowPathIcon className={`w-4 h-4 ${autoRefresh ? 'text-blue-600 animate-spin' : 'text-gray-600'}`} />
                            <span className="text-sm font-medium text-gray-700">Auto-refresh</span>
                        </label>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                    <StatCard label="Total Logs" value={logs.length.toString()} color="blue" />
                    <StatCard label="Info" value={levelCounts.info.toString()} color="green" />
                    <StatCard label="Warnings" value={levelCounts.warn.toString()} color="yellow" />
                    <StatCard label="Errors" value={levelCounts.error.toString()} color="red" />
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-sm"
                >
                    <div className="flex items-center space-x-2 mb-4">
                        <FunnelIcon className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-800">Filters</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Search Logs</label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-800"
                                    placeholder="Search by message or source..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Log Level</label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value as any)}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-800"
                            >
                                <option value="all">All Levels</option>
                                <option value="info">Info Only</option>
                                <option value="warn">Warnings Only</option>
                                <option value="error">Errors Only</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Logs Table */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Level
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Source
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Message
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence mode="popLayout">
                                    {filtered.map((log, index) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="hover:bg-blue-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <ClockIcon className="w-4 h-4 text-gray-400" />
                                                    <span>{new Date(log.time).toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <LevelBadge level={log.level} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {log.source || "System"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {log.message}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="text-center py-12">
                                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500">No logs match your filters</p>
                                <p className="text-sm text-gray-400 mt-2">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

function LevelBadge({ level }: { level: Log["level"] }) {
    const config = {
        info: {
            bg: "bg-blue-100",
            text: "text-blue-700",
            border: "border-blue-200",
            icon: InformationCircleIcon
        },
        warn: {
            bg: "bg-yellow-100",
            text: "text-yellow-700",
            border: "border-yellow-200",
            icon: ExclamationTriangleIcon
        },
        error: {
            bg: "bg-red-100",
            text: "text-red-700",
            border: "border-red-200",
            icon: XCircleIcon
        }
    }[level];

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="capitalize">{level}</span>
        </span>
    );
}

function StatCard({ label, value, color }: { label: string; value: string; color: "blue" | "green" | "yellow" | "red" }) {
    const colorConfig = {
        blue: { gradient: "from-blue-500 to-indigo-600", bg: "from-blue-50 to-indigo-50" },
        green: { gradient: "from-green-500 to-emerald-600", bg: "from-green-50 to-emerald-50" },
        yellow: { gradient: "from-yellow-500 to-orange-600", bg: "from-yellow-50 to-orange-50" },
        red: { gradient: "from-red-500 to-pink-600", bg: "from-red-50 to-pink-50" },
    }[color];

    return (
        <div className={`bg-gradient-to-br ${colorConfig.bg} rounded-2xl p-6 border border-gray-200 shadow-sm`}>
            <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${colorConfig.gradient} bg-clip-text text-transparent`}>
                {value}
            </p>
        </div>
    );
}
