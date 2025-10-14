import type { Route } from "./+types/support";
import { motion } from "framer-motion";
import {
    QuestionMarkCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    BookOpenIcon,
    VideoCameraIcon,
    ClockIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

export function meta({ }: Route.MetaArgs) {
    return [{ title: "Support - Camera Video Downloader" }];
}

export default function SupportRoute() {
    return (
        <main className="min-h-screen p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl shadow-blue-200 mb-4">
                        <QuestionMarkCircleIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                        How can we help?
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get assistance with your camera video management system
                    </p>
                </motion.div>

                {/* Contact Options */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-3 gap-6"
                >
                    <ContactCard
                        icon={EnvelopeIcon}
                        title="Email Support"
                        description="Get help via email"
                        contact="support@cvd.example.com"
                        action="Send Email"
                        color="blue"
                    />
                    <ContactCard
                        icon={ChatBubbleLeftRightIcon}
                        title="Live Chat"
                        description="Chat with our team"
                        contact="Available 24/7"
                        action="Start Chat"
                        color="green"
                    />
                    <ContactCard
                        icon={PhoneIcon}
                        title="Phone Support"
                        description="Call us directly"
                        contact="+1 (555) 123-4567"
                        action="Call Now"
                        color="purple"
                    />
                </motion.div>

                {/* Quick Help Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                    <div className="flex items-center space-x-3 mb-6">
                        <SparklesIcon className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Quick Start Guide</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <GuideStep
                            number="1"
                            title="Select a Camera"
                            description="Click on any camera card from the dashboard to view its details and recordings"
                            icon={VideoCameraIcon}
                        />
                        <GuideStep
                            number="2"
                            title="Choose Time Range"
                            description="Use the date and time pickers to select the exact period you want to export"
                            icon={ClockIcon}
                        />
                        <GuideStep
                            number="3"
                            title="Export Video"
                            description="Click the 'Export Video' button to generate a downloadable video file"
                            icon={DocumentTextIcon}
                        />
                        <GuideStep
                            number="4"
                            title="Download & Share"
                            description="Preview the video in the modal player and download it to your device"
                            icon={BookOpenIcon}
                        />
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <BookOpenIcon className="w-6 h-6 mr-3 text-blue-600" />
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        <FAQItem
                            question="How do I export videos from multiple cameras?"
                            answer="Select each camera individually and export the time range you need. You can download multiple videos and combine them using video editing software if needed."
                        />
                        <FAQItem
                            question="What video formats are supported?"
                            answer="The system exports videos in .mov format by default, which is compatible with most modern browsers and video players. Additional format support is coming soon."
                        />
                        <FAQItem
                            question="How long are videos stored in the system?"
                            answer="Videos are retained for 30 days by default. You can adjust retention policies in the system settings based on your storage plan."
                        />
                        <FAQItem
                            question="Can I access videos from mobile devices?"
                            answer="Yes! The interface is fully responsive and works on tablets and smartphones. For the best experience, we recommend using a modern browser."
                        />
                        <FAQItem
                            question="What should I do if a camera appears offline?"
                            answer="Check the System Status page for service health. If all services are operational, verify the camera's network connection and power supply. Contact support if issues persist."
                        />
                    </div>
                </motion.div>

                {/* Additional Resources */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
                >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Need More Help?</h3>
                    <p className="text-gray-700 mb-6">
                        Our comprehensive documentation covers everything from basic setup to advanced features.
                        Visit our knowledge base or schedule a demo with our team.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                            View Documentation
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-200">
                            Schedule Demo
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

function ContactCard({
    icon: Icon,
    title,
    description,
    contact,
    action,
    color
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    contact: string;
    action: string;
    color: "blue" | "green" | "purple";
}) {
    const colorConfig = {
        blue: {
            gradient: "from-blue-500 to-indigo-600",
            bg: "from-blue-50 to-indigo-50",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        green: {
            gradient: "from-green-500 to-emerald-600",
            bg: "from-green-50 to-emerald-50",
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        purple: {
            gradient: "from-purple-500 to-pink-600",
            bg: "from-purple-50 to-pink-50",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600"
        },
    }[color];

    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-gradient-to-br ${colorConfig.bg} rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300`}
        >
            <div className={`${colorConfig.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${colorConfig.iconColor}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <p className="text-sm font-semibold text-gray-800 mb-4">{contact}</p>
            <button className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${colorConfig.gradient} hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200`}>
                {action}
            </button>
        </motion.div>
    );
}

function GuideStep({
    number,
    title,
    description,
    icon: Icon
}: {
    number: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <div className="flex space-x-4">
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center shadow-lg">
                    {number}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <details className="group bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors">
            <summary className="font-semibold text-gray-800 cursor-pointer list-none flex items-center justify-between">
                <span>{question}</span>
                <svg
                    className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </summary>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{answer}</p>
        </details>
    );
}
