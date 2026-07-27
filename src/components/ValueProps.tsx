"use client";

import {
    LuLightbulb,
    LuBrain,
    LuCalendarClock,
    LuUsers,
    LuMessageSquare,
    LuTrendingUp,
} from "react-icons/lu";
import { useI18n } from "@/contexts/I18nProvider";

// Six teaching principles ("How we actually teach"). Icons + colours stay here;
// all text comes from i18n (teachApproach.p1…p6) so it follows the language toggle.
const principles = [
    { key: "p1", icon: <LuLightbulb size={20} />, iconClass: "bg-amber-100 text-amber-600", tagClass: "bg-amber-50 text-amber-700" },
    { key: "p2", icon: <LuBrain size={20} />, iconClass: "bg-emerald-100 text-emerald-600", tagClass: "bg-emerald-50 text-emerald-700" },
    { key: "p3", icon: <LuCalendarClock size={20} />, iconClass: "bg-teal-100 text-teal-600", tagClass: "bg-teal-50 text-teal-700" },
    { key: "p4", icon: <LuUsers size={20} />, iconClass: "bg-blue-100 text-blue-600", tagClass: "bg-blue-50 text-blue-700" },
    { key: "p5", icon: <LuMessageSquare size={20} />, iconClass: "bg-indigo-100 text-indigo-600", tagClass: "bg-indigo-50 text-indigo-700" },
    { key: "p6", icon: <LuTrendingUp size={20} />, iconClass: "bg-rose-100 text-rose-600", tagClass: "bg-rose-50 text-rose-700" },
];

export default function ValueProps() {
    const { t } = useI18n();
    return (
        <section className="py-24 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-5">
                        {t("teachApproach.badge")}
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
                        {t("teachApproach.title")}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                        {t("teachApproach.subtitle")}
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {principles.map((p) => (
                        <div
                            key={p.key}
                            className="flex flex-col bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-300"
                        >
                            <div className={`w-11 h-11 ${p.iconClass} rounded-xl flex items-center justify-center mb-5`}>
                                {p.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{t(`teachApproach.${p.key}.title`)}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">{t(`teachApproach.${p.key}.desc`)}</p>
                            <span className={`inline-block self-start mt-auto px-3 py-1 rounded-full text-xs font-medium ${p.tagClass}`}>
                                {t(`teachApproach.${p.key}.tag`)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
