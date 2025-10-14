import type { Route } from "./+types/app";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../auth";
import { motion } from "framer-motion";
import {
    HomeIcon,
    QuestionMarkCircleIcon,
    ServerIcon,
    DocumentTextIcon,
    ArrowRightOnRectangleIcon,
    VideoCameraIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
import {
    HomeIcon as HomeSolidIcon,
    QuestionMarkCircleIcon as QuestionSolidIcon,
    ServerIcon as ServerSolidIcon,
    DocumentTextIcon as DocumentSolidIcon
} from "@heroicons/react/24/solid";

export function meta({ }: Route.MetaArgs) {
    return [{ title: "Camera Video Downloader" }];
}

export default function AppLayoutRoute() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-lg flex flex-col"
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                            <VideoCameraIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                CVD
                            </h2>
                            <p className="text-xs text-gray-500">Camera Video Downloader</p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <UserCircleIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                        Navigation
                    </p>
                    <SidebarLink to="/" icon={HomeIcon} solidIcon={HomeSolidIcon}>
                        Dashboard
                    </SidebarLink>
                    <SidebarLink to="/status" icon={ServerIcon} solidIcon={ServerSolidIcon}>
                        System Status
                    </SidebarLink>
                    <SidebarLink to="/logs" icon={DocumentTextIcon} solidIcon={DocumentSolidIcon}>
                        Activity Logs
                    </SidebarLink>
                    <SidebarLink to="/support" icon={QuestionMarkCircleIcon} solidIcon={QuestionSolidIcon}>
                        Support
                    </SidebarLink>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Logout</span>
                    </motion.button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <section className="flex-1 overflow-y-auto overflow-x-hidden">
                <Outlet />
            </section>
        </div>
    );
}

function SidebarLink({
    to,
    icon: Icon,
    solidIcon: SolidIcon,
    children
}: {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    solidIcon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`
            }
            end
        >
            {({ isActive }) => (
                <>
                    {isActive ? (
                        <SolidIcon className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <Icon className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="font-medium text-sm">{children}</span>
                    {isActive && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl -z-10"
                            transition={{ type: "spring", duration: 0.5 }}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}
