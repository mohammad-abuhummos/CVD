import type { Route } from "./+types/status";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ServerIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    ClockIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";

type ServiceStatus = "operational" | "degraded" | "down";

type StatusRow = {
    name: string;
    status: ServiceStatus;
    description: string;
    uptime: string;
};

export function meta({ }: Route.MetaArgs) {
    return [{ title: "System Status - Camera Video Downloader" }];
}

export default function StatusRoute() {
    const [rows, setRows] = useState<StatusRow[]>([]);
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    useEffect(() => {
        // Mock system status
        setRows([
            {
                name: "API Server",
                status: "operational",
                description: "Main application server handling requests",
                uptime: "99.98%"
            },
            {
                name: "Video Transcoder",
                status: "operational",
                description: "Processing and encoding video streams",
                uptime: "99.95%"
            },
            {
                name: "Storage Service",
                status: "operational",
                description: "Cloud storage for video files",
                uptime: "99.99%"
            },
            {
                name: "Database",
                status: "operational",
                description: "PostgreSQL database cluster",
                uptime: "100%"
            },
            {
                name: "Authentication",
                status: "operational",
                description: "User authentication and authorization",
                uptime: "99.97%"
            },
        ]);
    }, []);

    const overallStatus = rows.every(r => r.status === "operational")
        ? "operational"
        : rows.some(r => r.status === "down")
            ? "down"
            : "degraded";

    return (
        <main className="min-h-screen p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                            System Status
                        </h1>
                        <p className="text-gray-600 flex items-center space-x-2">
                            <ClockIcon className="w-4 h-4" />
                            <span>Last checked: {lastCheck.toLocaleTimeString()}</span>
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLastCheck(new Date())}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-gray-700 font-medium"
                    >
                        Refresh
                    </motion.button>
                </motion.div>

                {/* Overall Status Card */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-2xl p-6 border-2 shadow-lg ${overallStatus === "operational"
                            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                            : overallStatus === "degraded"
                                ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                                : "bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
                        }`}
                >
                    <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-2xl ${overallStatus === "operational"
                                ? "bg-green-100"
                                : overallStatus === "degraded"
                                    ? "bg-yellow-100"
                                    : "bg-red-100"
                            }`}>
                            {overallStatus === "operational" ? (
                                <CheckCircleIcon className="w-8 h-8 text-green-600" />
                            ) : overallStatus === "degraded" ? (
                                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
                            ) : (
                                <XCircleIcon className="w-8 h-8 text-red-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                {overallStatus === "operational" ? "All Systems Operational" :
                                    overallStatus === "degraded" ? "Partial System Outage" :
                                        "System Outage"}
                            </h2>
                            <p className="text-gray-600">
                                {overallStatus === "operational"
                                    ? "All services are running normally"
                                    : "Some services are experiencing issues"}
                            </p>
                        </div>
                        <ChartBarIcon className="w-12 h-12 text-gray-300" />
                    </div>
                </motion.div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    {rows.map((service, index) => (
                        <motion.div
                            key={service.name}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2.5 rounded-xl">
                                        <ServerIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{service.name}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <StatusBadge status={service.status} />
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Uptime</p>
                                    <p className="text-sm font-semibold text-gray-800">{service.uptime}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* System Metrics */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-sm"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Performance Metrics (Last 24h)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard label="Avg Response Time" value="124ms" color="blue" />
                        <MetricCard label="Requests" value="1.2M" color="green" />
                        <MetricCard label="Success Rate" value="99.8%" color="indigo" />
                        <MetricCard label="Active Users" value="342" color="purple" />
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

function StatusBadge({ status }: { status: ServiceStatus }) {
    const config = {
        operational: {
            color: "bg-green-100 text-green-700 border-green-200",
            dot: "bg-green-500",
            icon: CheckCircleIcon,
            label: "Operational"
        },
        degraded: {
            color: "bg-yellow-100 text-yellow-700 border-yellow-200",
            dot: "bg-yellow-500",
            icon: ExclamationTriangleIcon,
            label: "Degraded"
        },
        down: {
            color: "bg-red-100 text-red-700 border-red-200",
            dot: "bg-red-500",
            icon: XCircleIcon,
            label: "Down"
        }
    }[status];

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-medium text-sm ${config.color}`}>
            <Icon className="w-4 h-4" />
            <span>{config.label}</span>
        </span>
    );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: "blue" | "green" | "indigo" | "purple" }) {
    const colorClasses = {
        blue: "from-blue-500 to-indigo-600",
        green: "from-green-500 to-emerald-600",
        indigo: "from-indigo-500 to-purple-600",
        purple: "from-purple-500 to-pink-600"
    }[color];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">{label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${colorClasses} bg-clip-text text-transparent`}>
                {value}
            </p>
        </div>
    );
}
