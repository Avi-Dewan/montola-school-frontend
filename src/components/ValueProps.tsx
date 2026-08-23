"use client";

import { useState } from "react";
import {
    LuLightbulb,
    LuBrain,
    LuCalendarClock,
    LuUsers,
    LuMessageSquare,
    LuTrendingUp,
    LuSparkles,
    LuChevronDown,
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

function Card({ p, t }: { p: (typeof principles)[number]; t: (k: string) => string }) {
    return (
        <div className="flex flex-col bg-white p-6 md:p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-300">
            <div className={`w-11 h-11 ${p.iconClass} rounded-xl flex items-center justify-center mb-5`}>
                {p.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t(`teachApproach.${p.key}.title`)}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{t(`teachApproach.${p.key}.desc`)}</p>
            <span className={`inline-block self-start mt-auto px-3 py-1 rounded-full text-xs font-medium ${p.tagClass}`}>
                {t(`teachApproach.${p.key}.tag`)}
            </span>
        </div>
    );
}

export default function ValueProps() {
    const { t } = useI18n();
    // Mobile only: six tall cards is a long scroll, so they stay folded
    // until the visitor asks for them.
    const [open, setOpen] = useState(false);

    return (
        <section className="py-16 md:py-24 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-5">
                        {t("teachApproach.badge")}
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl text-gray-900 mb-4">
                        {t("teachApproach.title")}
                    </h2>
                    <p className="text-gray-600 md:text-lg leading-relaxed max-w-2xl">
                        {t("teachApproach.subtitle")}
                    </p>
                </div>

                {/* Mobile trigger */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    className="md:hidden w-full flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-left active:scale-[0.99] transition"
                >
                    <span className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <LuSparkles size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-bold text-gray-900">{t("teachApproach.principlesLabel")}</span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                            {open ? t("teachApproach.hideCta") : t("teachApproach.revealCta")}
                        </span>
                    </span>
                    <LuChevronDown
                        size={20}
                        className={`shrink-0 text-primary-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                </button>

                {/* Mobile: staggered reveal */}
                <div
                    className={`md:hidden grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                    <div className="overflow-hidden">
                        <div className="flex flex-col gap-4 pt-4">
                            {principles.map((p, i) => (
                                <div
                                    key={p.key}
                                    style={{ transitionDelay: `${open ? i * 70 : 0}ms` }}
                                    className={`transition-all duration-500 ${open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-[0.97]"}`}
                                >
                                    <Card p={p} t={t} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop: always visible */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {principles.map((p) => (
                        <Card key={p.key} p={p} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
}
