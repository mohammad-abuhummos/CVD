import type { Route } from "./+types/dashboard";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    VideoCameraIcon,
    CalendarIcon,
    ArrowDownTrayIcon,
    PlayIcon,
    XMarkIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { DateTimePicker } from "../components/DateTimePicker";
import { getChannels, downloadVideo, type StreamingChannel } from "../api";

type VideoRecord = {
    id: string;
    cameraId: string;
    timestamp: string;
    duration: string;
    size: string;
    thumbnail?: string;
};
// Videos list for history can be populated from successful downloads

export function meta({ }: Route.MetaArgs) {
    return [{ title: "Dashboard - Camera Video Downloader" }];
}

export default function DashboardRoute() {
    const [channels, setChannels] = useState<StreamingChannel[]>([]);
    const [isLoadingChannels, setIsLoadingChannels] = useState<boolean>(true);
    const [channelsError, setChannelsError] = useState<string | null>(null);

    const [selectedChannel, setSelectedChannel] = useState<StreamingChannel | null>(null);
    const [startDateTime, setStartDateTime] = useState<string>("");
    const [durationMinutes, setDurationMinutes] = useState<string>("10");
    const [searchQuery, setSearchQuery] = useState("");
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<VideoRecord | null>(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
    const [showExportForm, setShowExportForm] = useState(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setIsLoadingChannels(true);
                const list = await getChannels();
                if (!mounted) return;
                setChannels(list);
                setChannelsError(null);
            } catch (err) {
                if (!mounted) return;
                setChannelsError(err instanceof Error ? err.message : "Failed to load channels");
            } finally {
                if (mounted) setIsLoadingChannels(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        return () => {
            if (currentVideoUrl) URL.revokeObjectURL(currentVideoUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideoUrl]);

    const filteredChannels = channels.filter(ch => {
        const q = searchQuery.toLowerCase();
        const idMatch = (ch.id || "").toLowerCase().includes(q);
        const nameMatch = (ch.channelName || "").toLowerCase().includes(q);
        const codec = (ch.Video?.videoCodecType || "").toLowerCase().includes(q);
        return idMatch || nameMatch || codec;
    });

    const handleChannelSelect = (ch: StreamingChannel) => {
        setSelectedChannel(ch);
        setShowExportForm(false);
        setStartDateTime("");
        setDurationMinutes("10");
    };

    const handleExportVideo = async () => {
        if (!selectedChannel || !startDateTime || !durationMinutes) return;
        const channelNum = parseInt(String(selectedChannel.id), 10);
        const duration = parseInt(String(durationMinutes), 10);
        if (Number.isNaN(channelNum) || Number.isNaN(duration)) return;

        setDownloadError(null);
        setIsDownloading(true);
        try {
            if (currentVideoUrl) {
                URL.revokeObjectURL(currentVideoUrl);
                setCurrentVideoUrl(null);
            }
            const blob = await downloadVideo({
                channel: channelNum,
                dayWithTime: startDateTime,
                durationInMinutes: duration,
            });
            const url = URL.createObjectURL(blob);
            setCurrentVideoUrl(url);
            const sizeMb = `${(blob.size / (1024 * 1024)).toFixed(1)} MB`;
            setCurrentVideo({
                id: `vid-${Date.now()}`,
                cameraId: String(selectedChannel.id),
                timestamp: new Date(startDateTime).toLocaleString(),
                duration: `${duration}m`,
                size: sizeMb,
            });
            setIsVideoModalOpen(true);
            setShowExportForm(false);
        } catch (err) {
            setDownloadError(err instanceof Error ? err.message : "Failed to download video");
        } finally {
            setIsDownloading(false);
        }
    };

    const cameraVideos: VideoRecord[] = [];

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Title */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                        Camera Dashboard
                    </h1>
                    <p className="text-gray-600">Manage and export your camera footage</p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search cameras by name or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-800 shadow-sm"
                        />
                    </div>
                </motion.div>

                {/* Channel Grid */}
                {!selectedChannel && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <VideoCameraIcon className="w-6 h-6 mr-2 text-blue-600" />
                            Available Channels {isLoadingChannels ? "(loading...)" : `(${filteredChannels.length})`}
                        </h2>
                        {channelsError && (
                            <div className="mb-4 text-sm text-red-600">{channelsError}</div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredChannels.map((ch, index) => (
                                    <motion.div
                                        key={ch.id}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                        onClick={() => handleChannelSelect(ch)}
                                        className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-green-100 group-hover:bg-green-200 transition-colors duration-200`}>
                                                <VideoCameraIcon className={`w-6 h-6 text-green-600`} />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700`}>
                                                ● Enabled
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                            Channel {ch.channelName || ch.id}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {ch.Video?.videoCodecType || 'Codec N/A'} • {ch.Video?.videoResolutionWidth && ch.Video?.videoResolutionHeight
                                                ? `${ch.Video.videoResolutionWidth}x${ch.Video.videoResolutionHeight}`
                                                : 'Resolution N/A'}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-xs text-gray-500">Click to view</span>
                                            <PlayIcon className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* Selected Channel View */}
                {selectedChannel && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        {/* Back Button & Channel Info */}
                        <div className="mb-6">
                            <button
                                onClick={() => setSelectedChannel(null)}
                                className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center group"
                            >
                                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Channels
                            </button>
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                                            <VideoCameraIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Channel {selectedChannel.channelName || selectedChannel.id}</h2>
                                            <p className="text-sm text-gray-600">Codec: {selectedChannel.Video?.videoCodecType || 'N/A'} • {selectedChannel.Video?.videoResolutionWidth && selectedChannel.Video?.videoResolutionHeight ? `${selectedChannel.Video.videoResolutionWidth}x${selectedChannel.Video.videoResolutionHeight}` : 'Resolution N/A'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowExportForm(!showExportForm)}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all duration-200"
                                    >
                                        {showExportForm ? 'Cancel Export' : 'Export Video'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Export Form */}
                        <AnimatePresence>
                            {showExportForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-visible"
                                >
                                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-blue-200 shadow-lg overflow-visible">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                            <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                                            Select start time and duration
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <DateTimePicker
                                                value={startDateTime}
                                                onChange={setStartDateTime}
                                                label="Start date & time"
                                                placeholder="Select date and time"
                                            />
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    step={1}
                                                    value={durationMinutes}
                                                    onChange={(e) => setDurationMinutes(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-800"
                                                    placeholder="e.g. 10"
                                                />
                                            </div>
                                        </div>
                                        {downloadError && (
                                            <div className="mt-2 text-sm text-red-600">{downloadError}</div>
                                        )}
                                        <button
                                            onClick={handleExportVideo}
                                            disabled={!startDateTime || !durationMinutes || isDownloading}
                                            className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                                        >
                                            {isDownloading ? 'Generating…' : 'Generate & Export Video'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Video History */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <PlayIcon className="w-6 h-6 mr-2 text-blue-600" />
                                Recent Videos ({cameraVideos.length})
                            </h3>
                            {cameraVideos.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <VideoCameraIcon className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">No videos available for this channel</p>
                                    <p className="text-sm text-gray-400 mt-2">Export a video to get started</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {cameraVideos.map((video, index) => (
                                        <motion.div
                                            key={video.id}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => {
                                                setCurrentVideo(video);
                                                setIsVideoModalOpen(true);
                                            }}
                                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                                                <PlayIcon className="w-12 h-12 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                    {video.duration}
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 mb-1">{video.timestamp}</p>
                                            <p className="text-xs text-gray-500">{video.size}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Video Modal */}
            <Transition appear show={isVideoModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsVideoModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
                                        <Dialog.Title className="text-xl font-semibold text-white flex items-center">
                                            <PlayIcon className="w-6 h-6 mr-2" />
                                            Video Player
                                        </Dialog.Title>
                                        <button
                                            onClick={() => setIsVideoModalOpen(false)}
                                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        {currentVideo && (
                                            <>
                                                <video
                                                    controls
                                                    autoPlay
                                                    className="w-full rounded-xl bg-black shadow-lg mb-4"
                                                    src={currentVideoUrl || ""}
                                                />
                                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Channel:</span>
                                                            <span className="ml-2 font-medium text-gray-800">
                                                                Channel {selectedChannel?.channelName || selectedChannel?.id}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Timestamp:</span>
                                                            <span className="ml-2 font-medium text-gray-800">{currentVideo.timestamp}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Duration:</span>
                                                            <span className="ml-2 font-medium text-gray-800">{currentVideo.duration}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Size:</span>
                                                            <span className="ml-2 font-medium text-gray-800">{currentVideo.size}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a
                                                    href={currentVideoUrl || undefined}
                                                    download={`channel-${selectedChannel?.id}-${currentVideo.timestamp}.mp4`}
                                                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                                >
                                                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                                                    Download Video
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
