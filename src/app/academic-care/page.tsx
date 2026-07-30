"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import {
    LuBrain, LuCalendarClock, LuShuffle, LuLightbulb, LuUsers,
    LuPencil, LuTarget, LuCheck, LuArrowRight, LuMapPin, LuMail, LuTriangleAlert, LuX, LuPhone,
} from "react-icons/lu";
import schoolInfo from "@/config/schoolInfo.json";
import { submitCareLead } from "@/lib/care";

const WA = schoolInfo.academicCare.whatsapp;
const PHONE = schoolInfo.phone;
const waLink = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

// Kept religion-neutral on purpose — Khagrachari families are Buddhist,
// Hindu, Christian and Muslim, and this text is sent *by the parent*.
const WA_INFO = "আমি মোনতলা একাডেমিক কেয়ার সম্পর্কে জানতে চাই।";
const WA_TRIAL = "আমি ফ্রি ট্রায়াল বুক করতে চাই।";

const bnIndex = ["০১", "০২", "০৩", "০৪", "০৫", "০৬"];

const worries = [
    "সারাদিন কাজের ব্যস্ততায় সন্তানকে সময় দিতে পারছি না",
    "কোচিংয়ের পরও বেসিক দুর্বল",
    "বিজ্ঞান ও গণিতে ভয়",
    "বাংলা ও ইংরেজিতে নিজের মতো গুছিয়ে লিখতে পারে না",
    "পড়া মুখস্থ থাকছে না, ফলাফল বদলাচ্ছে না",
    "মোবাইল ও খারাপ সঙ্গে হারিয়ে যাওয়ার ভয়",
    "বাবা-মায়ের কথার অবাধ্য",
    "হাতের লেখা খারাপ ও অগোছালো",
    "শৃঙ্খলা ও মনোযোগের অভাব",
];

// The wrong way learning happens in most schools & coachings
const wrongWays = [
    { wrong: "শুধু শুনে যাওয়া", right: "স্যার বলে যান, সন্তান শুধু শোনে। “বুঝেছ?” — “জ্বি স্যার।” কিন্তু নিজে করে দেখা হয় না।" },
    { wrong: "বুঝে নয়, মুখস্থ", right: "তোতাপাখির মতো মুখস্থ। প্রশ্ন একটু ঘুরিয়ে দিলেই সন্তান আটকে যায়।" },
    { wrong: "পরীক্ষার আগে রাত জেগে গেলা", right: "সারা বছর জমিয়ে রেখে এক রাতে সব পড়া — মস্তিষ্ক এভাবে ধরে রাখতে পারে না।" },
    { wrong: "রিভিশন নেই", right: "আজ যা শেখে, কয়েকদিন পর তা মুছে যায়। কেউ ফিরে দেখায় না।" },
    { wrong: "সবার জন্য একই নিয়ম", right: "দুর্বল-মেধাবী সবাইকে একভাবে পড়ানো। যার যেখানে সমস্যা, তা আলাদা করে দেখা হয় না।" },
];

const routine = [
    { mins: 10, time: "১০ মিনিট", title: "মোবাইল জমা ও দিনের লক্ষ্য", tag: "Focus", desc: "সব মোবাইল লকারে; বোর্ডে আজকের লক্ষ্য — মনোযোগের সবচেয়ে বড় শত্রু দূরে।", icon: LuTarget },
    { mins: 40, time: "৪০ মিনিট", title: "গতকালের মেমরি-টেস্ট", tag: "Active Recall", desc: "বই বন্ধ রেখে ১০–১৫টি দ্রুত প্রশ্ন — ঠিক ভুলে যাওয়ার আগমুহূর্তে স্মৃতি পাকা।", icon: LuBrain },
    { mins: 90, time: "৯০ মিনিট", title: "নতুন অধ্যায়, ২৫+৫ ছন্দে", tag: "Elaboration", desc: "২৫ মিনিট গভীর পড়া + ৫ মিনিট বিরতি; ‘কেন/কীভাবে’ প্রশ্নে বুঝিয়ে শেখানো।", icon: LuLightbulb },
    { mins: 60, time: "৬০ মিনিট", title: "তত্ত্বাবধানে মিশ্র অনুশীলন", tag: "Interleaving", desc: "বিভিন্ন ধরনের ১৫–২০টি সমস্যা মিশিয়ে; প্রতিটি ভুল সঙ্গে সঙ্গে শোধরানো।", icon: LuShuffle },
    { mins: 50, time: "৫০ মিনিট", title: "শিখিয়ে শেখা ও দুর্বলতা মেরামত", tag: "Protégé Effect", desc: "শিক্ষার্থী নিজেই বোর্ডে বোঝায়; যে যেখানে আটকে, তার জন্য আলাদা যত্ন।", icon: LuUsers },
    { mins: 30, time: "৩০ মিনিট", title: "হাতের লেখা, রিভিশন কার্ড ও রিপোর্ট", tag: "Report", desc: "পরিচ্ছন্ন লেখার চর্চা; মূল পয়েন্ট রিভিশন কার্ডে; অভিভাবকের কাছে দিনের রিপোর্ট।", icon: LuPencil },
];

const methods = [
    { icon: LuShuffle, name: "মিশ্র অনুশীলন", en: "Interleaving", desc: "একই ধরনের অঙ্ক টানা না করে বিভিন্ন ধরন মিশিয়ে অনুশীলন। কোন নিয়ম কোথায় লাগবে, সন্তান নিজেই বেছে নিতে শেখে।" },
    { icon: LuLightbulb, name: "নিজের ভাষায় ব্যাখ্যা", en: "Elaboration", desc: "‘কেন’ ও ‘কীভাবে’ প্রশ্ন করে নতুন বিষয়কে আগের জানার সঙ্গে জুড়ে দেওয়া। মুখস্থ নয়, তৈরি হয় প্রকৃত বোঝাপড়া।" },
    { icon: LuUsers, name: "শিখিয়ে শেখা", en: "The Protégé Effect", desc: "সন্তান নিজেই শিক্ষক হয়ে বন্ধু বা বোর্ডে বুঝিয়ে দেয়। ‘আমাকে পড়াতে হবে’ — এই দায়িত্ববোধেই বিষয়টা সবচেয়ে গভীরে গাঁথে।" },
];

// The change parents will actually see (problem → outcome)
const outcomes = [
    { from: "কোচিংয়ের পরও বেসিক দুর্বল", to: "মজবুত বেসিক — উপরের ক্লাসের জন্য প্রস্তুত" },
    { from: "মুখস্থ করে, পরীক্ষায় ভুলে যায়", to: "বুঝে শেখে, পরীক্ষার দিনও মনে থাকে" },
    { from: "মোবাইলে আসক্ত, মনোযোগ নেই", to: "শৃঙ্খলা, একাগ্রতা ও সময়ের হিসাব" },
    { from: "হাতের লেখা খারাপ", to: "পরিচ্ছন্ন, সুন্দর উপস্থাপন" },
    { from: "ফলাফল বছরের পর বছর একই", to: "পরীক্ষায় মাপা, স্পষ্ট উন্নতি" },
    { from: "সন্তান সত্যিই শিখছে কি না, অজানা", to: "প্রতিদিনের রিপোর্ট — সব চোখের সামনে" },
];

function ForgettingCurve() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <svg viewBox="0 0 440 250" className="w-full h-auto" role="img" aria-label="ভুলে যাওয়ার বক্ররেখা">
                {/* axes */}
                <line x1="40" y1="20" x2="40" y2="210" stroke="#e5e7eb" strokeWidth="2" />
                <line x1="40" y1="210" x2="420" y2="210" stroke="#e5e7eb" strokeWidth="2" />
                {/* red: no revision */}
                <path d="M40,25 C95,150 150,185 420,195" fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" />
                {/* green: with spaced revision (sawtooth recovery) */}
                <path d="M40,25 L120,120 L120,38 L205,100 L205,32 L305,85 L305,26 L420,34" fill="none" stroke="#2ca83e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {/* revision dots */}
                <circle cx="120" cy="38" r="4" fill="#2ca83e" /><circle cx="205" cy="32" r="4" fill="#2ca83e" /><circle cx="305" cy="26" r="4" fill="#2ca83e" />
                {/* labels */}
                <text x="30" y="20" textAnchor="end" fontSize="11" fill="#9ca3af">১০০%</text>
                <text x="30" y="200" textAnchor="end" fontSize="11" fill="#9ca3af">০%</text>
                <text x="120" y="228" textAnchor="middle" fontSize="11" fill="#9ca3af">দিন ১</text>
                <text x="205" y="228" textAnchor="middle" fontSize="11" fill="#9ca3af">দিন ৩</text>
                <text x="305" y="228" textAnchor="middle" fontSize="11" fill="#9ca3af">দিন ৭</text>
                <text x="420" y="188" textAnchor="end" fontSize="11" fill="#e11d48" fontWeight="bold">ভুলে যায়</text>
                <text x="335" y="20" textAnchor="start" fontSize="11" fill="#2ca83e" fontWeight="bold">মনে থাকে</text>
            </svg>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-2 text-xs">
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-rose-600" /> রিভিশন ছাড়া — যা স্কুল-কোচিংয়ে হয়</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-primary-500" /> স্পেসড রিভিশনসহ — আমাদের নিয়ম</span>
            </div>
        </div>
    );
}

function LeadForm() {
    const [f, setF] = useState({ name: "", phone: "", level: "Class 6-8", area: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!f.name.trim() || !f.phone.trim()) return toast.error("নাম ও ফোন নম্বর দিন।");
        if (!/^(01)[3-9][0-9]{8}$/.test(f.phone.trim())) return toast.error("সঠিক মোবাইল নম্বর দিন (যেমন 01712345678)।");
        setLoading(true);
        try {
            await submitCareLead(f);
            setDone(true);
        } catch {
            toast.error("সমস্যা হয়েছে, আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="bg-white rounded-2xl border border-primary-200 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mx-auto mb-4"><LuCheck size={28} /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ধন্যবাদ! আপনার অনুরোধ পেয়েছি।</h3>
                <p className="text-gray-600 mb-5">আমরা শীঘ্রই আপনাকে ফোন করব। দ্রুত কথা বলতে চাইলে সরাসরি WhatsApp করুন।</p>
                <a href={waLink(WA_INFO)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:brightness-95">
                    <FaWhatsapp size={20} /> WhatsApp করুন
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">ফ্রি ৭ দিনের ট্রায়াল বুক করুন</h3>
            <p className="text-sm text-gray-500 -mt-2">শুধু নাম ও নম্বর দিন — আমরা কল করে বিস্তারিত জানাব। কোনো খরচ নেই।</p>
            <input className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="আপনার নাম *" value={f.name} onChange={(e) => set("name", e.target.value)} />
            <input className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="মোবাইল নম্বর * (যেমন 01712345678)" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
                <select className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary-500" value={f.level} onChange={(e) => set("level", e.target.value)}>
                    <option value="Class 6-8">Class 6–8</option>
                    <option value="SSC">Class 9–10 (SSC)</option>
                    <option value="Other">অন্যান্য</option>
                </select>
                <input className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="এলাকা" value={f.area} onChange={(e) => set("area", e.target.value)} />
            </div>
            <textarea className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" rows={2} placeholder="কিছু বলতে চাইলে (ঐচ্ছিক)" value={f.message} onChange={(e) => set("message", e.target.value)} />
            <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-700 transition disabled:opacity-60">
                {loading ? "পাঠানো হচ্ছে…" : "ফ্রি ট্রায়াল বুক করুন"}
            </button>
        </form>
    );
}

export default function AcademicCarePage() {
    return (
        <main className="overflow-x-hidden pb-20 md:pb-0">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-700 to-primary-800 text-white pt-28 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
                        <LuMapPin size={14} /> খাগড়াছড়ি · অফলাইন প্রোগ্রাম
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl font-medium leading-tight mb-5">
                        স্কুল চলছে, কোচিং চলছে —<br />কিন্তু সন্তান কি সত্যিই শিখছে?
                    </h1>
                    <p className="text-white/85 text-lg max-w-2xl mx-auto mb-8">
                        গতানুগতিক কোচিং নয় — <b className="text-white">মোনতলা একাডেমিক কেয়ার</b>-এ প্রতিদিন ৬ ঘণ্টা,
                        বিজ্ঞানসম্মত নিয়মে শেখা, অভ্যাস ও যত্ন — যাতে সন্তান মুখস্থ নয়, সত্যিই শেখে।
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a href="#book" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
                            ফ্রি ট্রায়াল বুক করুন <LuArrowRight size={18} />
                        </a>
                        {/* On mobile the sticky bottom bar already offers call + WhatsApp */}
                        <a href={`tel:${PHONE}`} className="hidden md:inline-flex items-center gap-2 bg-white/15 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition ring-1 ring-white/30">
                            <LuPhone size={19} /> সরাসরি কল করুন
                        </a>
                        <a href={waLink(WA_INFO)} target="_blank" rel="noreferrer" className="hidden md:inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:brightness-95 transition">
                            <FaWhatsapp size={20} /> WhatsApp
                        </a>
                    </div>
                    <p className="text-white/70 text-sm mt-5">প্রথম ৭ দিন সম্পূর্ণ ফ্রি · কোনো অগ্রিম খরচ নেই</p>
                </div>
            </section>

            {/* The question — talk to the parent */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                        প্রতি মাসে টাকা যাচ্ছে। শিক্ষক আন্তরিকভাবে পড়াচ্ছেন। মাঝে মাঝে জিজ্ঞেস করছেন — “বুঝেছ?” সন্তান বলছে ‘জ্বি স্যার’।
                        এভাবেই চলছে বছরের পর বছর — তবু পরীক্ষার খাতা খুললে গল্পটা একই থেকে যায়।
                    </p>
                    <p className="mt-5 font-serif italic text-xl text-primary-700">দোষ আপনার সন্তানের নয়। ঘাটতি পরিশ্রমে নয় — ঘাটতি পদ্ধতিতে।</p>
                </div>
            </section>

            {/* Worries */}
            <section className="py-14 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">এই চিন্তাগুলো কি চেনা লাগছে?</h2>
                    <p className="text-gray-500 text-center mb-10">রাতে যে ভাবনাগুলো অনেক অভিভাবকের ঘুম কাড়ে।</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {worries.map((w, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                                <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0"><LuTriangleAlert size={16} /></span>
                                <span className="text-gray-700">{w}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why this happens — the wrong way of learning in Bangladesh */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-3">কেন এমন হয়</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">আমাদের দেশে শেখার নিয়মটাই ভুল</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            বেশিরভাগ স্কুল-কোচিংয়ে পড়ানো হয় পুরনো, অকার্যকর নিয়মে। যত ঘণ্টাই পড়ুক, ফল একই — কারণ ভিত্তিটাই ঠিক নেই।
                        </p>
                    </div>
                    {/* Two columns so the lines stay readable and the block reads
                        tight rather than as five identical full-width bars. */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {wrongWays.map((w, i) => (
                            <div
                                key={i}
                                className="relative bg-white rounded-xl border border-gray-200 p-5 pl-6 overflow-hidden hover:border-rose-200 transition-colors"
                            >
                                <span className="absolute left-0 inset-y-0 w-1 bg-rose-400" aria-hidden />
                                <div className="flex items-start gap-3.5">
                                    <span className="text-base font-extrabold text-rose-300 leading-none shrink-0 mt-0.5">
                                        {bnIndex[i]}
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 leading-snug">{w.wrong}</h3>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{w.right}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The real cause — the forgetting curve */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-3">আসল কারণ</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">সন্তান ভুলে যায় — এটা অলসতা নয়, মস্তিষ্কের নিয়ম।</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            বিজ্ঞানীরা একে বলেন <b>“ভুলে যাওয়ার বক্ররেখা” (Forgetting Curve)</b>। রিভিশন না করলে —
                        </p>
                        <p className="text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4">
                            গবেষণায় দেখা গেছে, শেখা বিষয়ের <b className="text-rose-600">অর্ধেকেরও বেশি ২৪ ঘণ্টার মধ্যে ঝাপসা হয়ে যায়।</b>
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            তাই আজ যা শেখে, পরীক্ষার দিন তার বেশিরভাগই হারিয়ে যায়। নিচের লাল রেখা দেখুন — এভাবেই স্কুল-কোচিংয়ে
                            পড়া মুছে যায়। কিন্তু সবুজ রেখা বলছে — সঠিক নিয়মে রিভিশন করলে স্মৃতি উঁচুতে স্থির থাকে।
                        </p>
                    </div>
                    <ForgettingCurve />
                </div>
            </section>

            {/* The science that fixes it — Active Recall + Spaced Repetition */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-3">সমাধান বিজ্ঞানে আছে</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">আমরা অনুমানে পড়াই না।</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            বিশ্বের শীর্ষ বিশ্ববিদ্যালয়ের গবেষণায় প্রমাণিত পদ্ধতিতে পড়াই। এর মধ্যে <b>দুটি</b> সবচেয়ে শক্তিশালী —
                            যা সরাসরি ভুলে যাওয়াকে হারায়।
                        </p>
                        <p className="text-xs text-gray-400 mt-3">শিখন-বিজ্ঞানের স্বীকৃত গবেষণা অনুসরণে · Dunlosky, Roediger ও Karpicke</p>
                    </div>

                    {/* The two hero methods */}
                    <div className="grid md:grid-cols-2 gap-5 mb-8">
                        {[
                            {
                                Icon: LuBrain,
                                name: "সক্রিয় স্মরণ",
                                en: "Active Recall",
                                body: (
                                    <>
                                        পড়া মানে শুধু বই খুলে বসে থাকা নয়। বই বন্ধ রেখে নিজে মনে করার চেষ্টা করা — এভাবেই মস্তিষ্ক তথ্য
                                        “টেনে তোলে”, আর স্মৃতি পাকা হয়। আমরা প্রতিদিন ছোট কুইজ ও মুখে প্রশ্নোত্তর করাই।
                                    </>
                                ),
                                proof: (
                                    <>
                                        শুধু বারবার পড়ার চেয়ে দীর্ঘমেয়াদে <b>অনেক বেশি</b> মনে থাকে — গবেষণায় প্রমাণিত।
                                    </>
                                ),
                            },
                            {
                                Icon: LuCalendarClock,
                                name: "বিরতিতে পুনরাবৃত্তি",
                                en: "Spaced Repetition",
                                body: (
                                    <>
                                        একদিনে সব গিলে ফেলা নয়। একই বিষয় <b>১ দিন → ৩ দিন → ৭ দিন</b> পরপর পরিকল্পিতভাবে ফিরে দেখা —
                                        ঠিক ভুলে যাওয়ার আগমুহূর্তে। তাই পরীক্ষার দিনও সব মনে থাকে।
                                    </>
                                ),
                                proof: <>লাল রেখা নয় — সবুজ রেখা। ভুলে যাওয়াকে হারিয়ে স্মৃতি উঁচুতে স্থির থাকে।</>,
                            },
                        ].map((m, i) => {
                            const Icon = m.Icon;
                            return (
                                <div
                                    key={i}
                                    className="relative bg-white border-2 border-primary-100 rounded-2xl p-6 md:p-7 overflow-hidden hover:border-primary-300 transition-colors"
                                >
                                    {/* Oversized index, kept faint — signals "these are the two" */}
                                    <span
                                        className="absolute -top-3 right-3 text-6xl font-extrabold text-primary-50 select-none pointer-events-none"
                                        aria-hidden
                                    >
                                        {bnIndex[i]}
                                    </span>

                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                                                <Icon size={24} />
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">{m.name}</h3>
                                                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600">{m.en}</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed">{m.body}</p>

                                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-start gap-2.5">
                                            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                                                <LuCheck size={12} />
                                            </span>
                                            <p className="text-sm font-medium text-gray-800 leading-relaxed">{m.proof}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Supporting 3 methods */}
                    <p className="text-center text-sm text-gray-500 mb-4">এর সঙ্গে আরও ৩টি প্রমাণিত কৌশল বোঝাপড়া গভীর করে —</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {methods.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-primary-200 transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Icon size={20} /></span>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 leading-tight">{m.name}</h3>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{m.en}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{m.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* The solution */}
            <section className="py-16 px-6 bg-primary-700 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">আমরা যা করি</p>
                    <h2 className="font-serif text-3xl md:text-4xl font-medium mb-5">এটি কোচিং নয় — এটি সন্তানের সম্পূর্ণ একাডেমিক যত্ন।</h2>
                    <p className="text-white/85 text-lg leading-relaxed">
                        স্কুলের পর প্রতিদিন ৬ ঘণ্টা — আমাদের শিক্ষকদের সরাসরি তত্ত্বাবধানে সন্তান শুধু পড়ে না; শেখে কীভাবে সঠিকভাবে
                        পড়তে হয়, বুঝে শেখে, সঠিক অভ্যাস গড়ে এবং গড়ে ওঠে একজন আত্মবিশ্বাসী মানুষ হিসেবে।
                    </p>
                </div>
            </section>

            {/* A day's routine */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">একটি দিন — প্রতিটি মিনিট পরিকল্পিত</h2>
                        <p className="text-gray-500">এলোমেলো পড়া নয় — দিনের প্রতিটি ধাপ ওপরের বিজ্ঞানের ওপর সাজানো।</p>
                    </div>
                    {/* The volume, up front — this is the number that lands */}
                    <div className="grid grid-cols-3 gap-3 md:gap-5 mb-10">
                        {[
                            { n: "৬", u: "ঘণ্টা", l: "প্রতিদিন" },
                            { n: "২৬", u: "দিন", l: "প্রতি মাসে" },
                            { n: "১৫৬", u: "ঘণ্টা", l: "প্রতি মাসে" },
                        ].map((s, i) => (
                            <div key={i} className="bg-primary-700 text-white rounded-2xl p-4 md:p-5 text-center">
                                <p className="text-3xl md:text-4xl font-extrabold leading-none">{s.n}</p>
                                <p className="text-xs md:text-sm font-semibold text-white/80 mt-1">{s.u}</p>
                                <p className="text-[10px] md:text-xs uppercase tracking-wider text-white/50 mt-2">{s.l}</p>
                            </div>
                        ))}
                    </div>

                    {/* Timeline: the connecting rail plus a bar per block makes the
                        day read as one continuous, filled stretch. */}
                    <div className="relative">
                        <span className="absolute left-5 top-4 bottom-4 w-0.5 bg-primary-100 hidden sm:block" aria-hidden />

                        <div className="space-y-3">
                            {routine.map((r, i) => {
                                const Icon = r.icon;
                                const share = Math.round((r.mins / 90) * 100);
                                return (
                                    <div key={i} className="relative sm:pl-16">
                                        <span className="hidden sm:flex absolute left-0 top-5 w-10 h-10 rounded-full bg-primary-600 text-white items-center justify-center ring-4 ring-gray-50 z-10">
                                            <Icon size={18} />
                                        </span>

                                        <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-primary-300 transition-colors">
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="sm:hidden w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0">
                                                    <Icon size={18} />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-600">{r.tag}</span>
                                                    <h3 className="font-bold text-gray-900 leading-tight">{r.title}</h3>
                                                </div>
                                                <span className="text-sm font-extrabold text-primary-700 shrink-0 whitespace-nowrap">{r.time}</span>
                                            </div>

                                            {/* Duration drawn to scale — the 90-minute block visibly dominates */}
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                                                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${share}%` }} />
                                            </div>

                                            <p className="text-sm text-gray-600 leading-relaxed">{r.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Breaks close the gap between 4h40m of lessons and the 6-hour day */}
                            <div className="relative sm:pl-16">
                                <span className="hidden sm:flex absolute left-0 top-5 w-10 h-10 rounded-full bg-white text-primary-600 border-2 border-dashed border-primary-200 items-center justify-center ring-4 ring-gray-50 z-10">
                                    <LuCalendarClock size={18} />
                                </span>
                                <div className="bg-white/60 rounded-2xl border border-dashed border-gray-300 p-5 flex items-center gap-3">
                                    <span className="sm:hidden w-10 h-10 rounded-full bg-white text-primary-600 border-2 border-dashed border-primary-200 flex items-center justify-center shrink-0">
                                        <LuCalendarClock size={18} />
                                    </span>
                                    <p className="text-sm text-gray-600 flex-1">বিরতি ও বিশ্রাম — দুই দফায়, ২৫ মিনিট ও ১৫–২০ মিনিট</p>
                                    <span className="text-sm font-bold text-gray-500 shrink-0 whitespace-nowrap">৪৫ মিনিট</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="mt-6 bg-primary-50 border border-primary-100 rounded-2xl p-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="font-bold text-gray-900">সব মিলিয়ে প্রতিদিন</p>
                            <p className="text-sm text-gray-600 mt-0.5">এর মধ্যে বিরতি মাত্র ৪৫ মিনিট — বাকি পুরো সময়টাই পড়ায়</p>
                        </div>
                        <p className="text-2xl md:text-3xl font-extrabold text-primary-700 shrink-0 whitespace-nowrap">৬ ঘণ্টা</p>
                    </div>
                </div>
            </section>

            {/* True outcomes — problem → result */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">সমস্যা সমাধানের পর যা আপনি দেখবেন</h2>
                        <p className="text-gray-500">প্রতিটি চিন্তার জায়গায় একটি সত্যিকারের পরিবর্তন।</p>
                    </div>
                    <div className="space-y-3">
                        {outcomes.map((o, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center gap-2 text-gray-400 text-sm sm:w-1/2">
                                    <LuX className="text-rose-400 shrink-0" size={16} /> <span className="line-through">{o.from}</span>
                                </div>
                                <LuArrowRight className="hidden sm:block text-gray-300 shrink-0" size={18} />
                                <div className="flex items-center gap-2 text-gray-900 font-medium sm:w-1/2">
                                    <LuCheck className="text-primary-600 shrink-0" size={16} /> {o.to}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Proof, not guesswork */}
            <section className="py-14 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">প্রমাণ, অনুমান নয়</h2>
                    <p className="text-gray-500 mb-8">“কাজ হচ্ছে কি না” — আন্দাজ নয়, পরীক্ষিত।</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-gray-900 mb-1">নিয়মিত পরীক্ষা</h3>
                            <p className="text-sm text-gray-600">প্রতিটি অধ্যায় শেষে মূল্যায়ন — দুর্বলতা সঙ্গে সঙ্গে ধরা পড়ে।</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-gray-900 mb-1">অভিভাবকের কাছে রিপোর্ট</h3>
                            <p className="text-sm text-gray-600">সন্তানের অগ্রগতির নিয়মিত আপডেট সরাসরি আপনার কাছে।</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-gray-900 mb-1">স্টুডেন্টভেদে পরিকল্পনা</h3>
                            <p className="text-sm text-gray-600">দুর্বল ও মেধাবী — প্রত্যেকের জন্য আলাদা কাউন্সেলিং।</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offer + pricing */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block bg-primary-100 text-primary-800 text-sm font-bold px-4 py-1.5 rounded-full mb-4">পরিচিতি অফার</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">আগে দেখুন — তারপর সিদ্ধান্ত নিন</h2>
                    <p className="text-gray-600 mb-8">প্রথম ৭ দিন সম্পূর্ণ ফ্রি ট্রায়াল। সন্তানের পরিবর্তন নিজ চোখে বুঝে নিন — কোনো ঝুঁকি ছাড়াই।</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <p className="text-sm text-gray-500 mb-1">Class ৬ – ৮</p>
                            <p className="text-3xl font-bold text-gray-900">৮,০০০৳ <span className="text-base font-medium text-gray-500">থেকে / মাস</span></p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <p className="text-sm text-gray-500 mb-1">Class ৯ – ১০ (SSC)</p>
                            <p className="text-3xl font-bold text-gray-900">১০,০০০৳ <span className="text-base font-medium text-gray-500">থেকে / মাস</span></p>
                        </div>
                    </div>
                    <div className="max-w-2xl mx-auto mt-6 bg-primary-50 border border-primary-100 rounded-2xl p-5 text-left">
                        <p className="text-gray-800 font-semibold mb-2">হিসাবটা একবার দেখুন —</p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            মাসে ৬ ঘণ্টা × ২৬ দিন = <b>প্রায় ১৫৬ ঘণ্টা</b> তত্ত্বাবধানে পড়া। অর্থাৎ ঘণ্টাপ্রতি খরচ পড়ে
                            <b className="text-primary-800"> ৫০৳-এরও কম</b> — একজন প্রাইভেট টিউটরের ঘণ্টাপ্রতি খরচের প্রায় অর্ধেক,
                            অথচ সময় ও যত্ন কয়েক গুণ বেশি।
                        </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">* প্যাকেজ ও বিষয়ভেদে ফি ভিন্ন হতে পারে · আসন সীমিত</p>
                </div>
            </section>

            {/* Booking / contact */}
            <section id="book" className="py-16 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-medium text-gray-900 mb-4">সন্তানের ভবিষ্যৎ — আর পিছিয়ে নয়।</h2>
                        <p className="text-gray-600 mb-6">আজই ফ্রি ট্রায়াল বুক করুন, কল করুন — অথবা সরাসরি সেন্টার ঘুরে দেখুন।</p>
                        <div className="flex flex-wrap gap-3 mb-8">
                            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition">
                                <LuPhone size={19} /> কল করুন: {PHONE}
                            </a>
                            <a href={waLink(WA_TRIAL)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:brightness-95 transition">
                                <FaWhatsapp size={20} /> WhatsApp
                            </a>
                        </div>
                        <div className="space-y-3 text-gray-700">
                            <p className="flex items-start gap-3"><LuMapPin className="text-primary-600 mt-1 shrink-0" size={18} /> {schoolInfo.academicCare.address}</p>
                            <p className="flex items-center gap-3"><LuMail className="text-primary-600 shrink-0" size={18} /> {schoolInfo.email}</p>
                        </div>
                    </div>
                    <LeadForm />
                </div>
            </section>

            {/* Sticky mobile action bar — the page is long; keep calling one tap away */}
            <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-3 py-2.5 flex gap-2">
                <a href={`tel:${PHONE}`} className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 rounded-xl">
                    <LuPhone size={18} /> কল করুন
                </a>
                <a href={waLink(WA_INFO)} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-xl">
                    <FaWhatsapp size={19} /> WhatsApp
                </a>
            </div>
        </main>
    );
}
