"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import {
    LuBrain, LuCalendarClock, LuShuffle, LuLightbulb, LuUsers,
    LuPencil, LuTarget, LuCheck, LuArrowRight, LuMapPin, LuMail, LuTriangleAlert,
} from "react-icons/lu";
import schoolInfo from "@/config/schoolInfo.json";
import { submitCareLead } from "@/lib/care";

const WA = schoolInfo.academicCare.whatsapp;
const waLink = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

const worries = [
    "সারাদিন কাজের ব্যস্ততায় সন্তানকে সময় দিতে পারছি না",
    "কোচিংয়ের পরও বেসিক দুর্বল — বিশেষত Class 6–8",
    "মোবাইল ও খারাপ সঙ্গে হারিয়ে যাওয়ার ভয়",
    "পড়া মুখস্থ থাকছে না, ফলাফল বদলাচ্ছে না",
    "হাতের লেখা খারাপ, বাংলা–ইংরেজিতে দুর্বল",
    "শৃঙ্খলা ও মনোযোগের অভাব",
];

const routine = [
    { time: "১০ মিনিট", title: "মোবাইল জমা ও দিনের লক্ষ্য", tag: "Focus", desc: "সব মোবাইল লকারে; বোর্ডে আজকের লক্ষ্য — মনোযোগের সবচেয়ে বড় শত্রু দূরে।", icon: LuTarget },
    { time: "৪০ মিনিট", title: "গতকালের মেমরি-টেস্ট", tag: "Active Recall", desc: "বই বন্ধ রেখে ১০–১৫টি দ্রুত প্রশ্ন — ঠিক ভুলে যাওয়ার আগমুহূর্তে স্মৃতি পাকা।", icon: LuBrain },
    { time: "৯০ মিনিট", title: "নতুন অধ্যায়, ২৫+৫ ছন্দে", tag: "Elaboration", desc: "২৫ মিনিট গভীর পড়া + ৫ মিনিট বিরতি; ‘কেন/কীভাবে’ প্রশ্নে বুঝিয়ে শেখানো।", icon: LuLightbulb },
    { time: "৬০ মিনিট", title: "তত্ত্বাবধানে মিশ্র অনুশীলন", tag: "Interleaving", desc: "বিভিন্ন ধরনের ১৫–২০টি সমস্যা মিশিয়ে; প্রতিটি ভুল সঙ্গে সঙ্গে শোধরানো।", icon: LuShuffle },
    { time: "৫০ মিনিট", title: "শিখিয়ে শেখা ও দুর্বলতা মেরামত", tag: "Protégé Effect", desc: "শিক্ষার্থী নিজেই বোর্ডে বোঝায়; যে যেখানে আটকে, তার জন্য আলাদা যত্ন।", icon: LuUsers },
    { time: "৩০ মিনিট", title: "হাতের লেখা, রিভিশন কার্ড ও রিপোর্ট", tag: "Report", desc: "পরিচ্ছন্ন লেখার চর্চা; মূল পয়েন্ট রিভিশন কার্ডে; অভিভাবকের কাছে দিনের রিপোর্ট।", icon: LuPencil },
];

const methods = [
    { icon: LuBrain, name: "সক্রিয় স্মরণ", en: "Active Recall", desc: "বই না দেখে নিজে মনে করার চেষ্টা করে উত্তর বের করা। ছোট কুইজ ও মুখে প্রশ্নোত্তরে মস্তিষ্ক তথ্য ‘টেনে তোলে’ — আর তাতেই স্মৃতি পাকা হয়।", stat: "১.৫× বেশি দীর্ঘমেয়াদে মনে থাকে" },
    { icon: LuCalendarClock, name: "বিরতিতে পুনরাবৃত্তি", en: "Spaced Repetition", desc: "একদিনে সব নয়। একই বিষয় ১ দিন → ৩ দিন → ৭ দিন পরপর পরিকল্পিতভাবে ফিরে দেখা — ঠিক ভুলে যাওয়ার আগমুহূর্তে।", stat: "ভুলে যাওয়াকে হারিয়ে স্মৃতি উঁচুতে স্থির" },
    { icon: LuShuffle, name: "মিশ্র অনুশীলন", en: "Interleaving", desc: "একই ধরনের অঙ্ক টানা না করে বিভিন্ন ধরন মিশিয়ে অনুশীলন। কোন নিয়ম কোথায় লাগবে, সন্তান নিজেই বেছে নিতে শেখে।", stat: "গণিতে বিশেষভাবে কার্যকর" },
    { icon: LuLightbulb, name: "নিজের ভাষায় ব্যাখ্যা", en: "Elaboration", desc: "‘কেন’ ও ‘কীভাবে’ প্রশ্ন করে নতুন বিষয়কে আগের জানার সঙ্গে জুড়ে দেওয়া। মুখস্থ নয়, তৈরি হয় প্রকৃত বোঝাপড়া।", stat: "যা ভোলা কঠিন" },
    { icon: LuUsers, name: "শিখিয়ে শেখা", en: "The Protégé Effect", desc: "সন্তান নিজেই শিক্ষক হয়ে বন্ধু বা বোর্ডে বুঝিয়ে দেয়। ‘আমাকে পড়াতে হবে’ — এই দায়িত্ববোধেই বিষয়টা সবচেয়ে গভীরে গাঁথে।", stat: "শেখা ও স্মৃতি উল্লেখযোগ্যভাবে বাড়ায়" },
];

const results = [
    "মজবুত বেসিক — উপরের ক্লাসের জন্য প্রস্তুত",
    "মুখস্থ নয়, প্রকৃত বোঝাপড়া",
    "সুন্দর ও পরিচ্ছন্ন হাতের লেখা",
    "শৃঙ্খলা, একাগ্রতা ও সময় জ্ঞান",
    "পরীক্ষায় মাপা অগ্রগতি",
    "মোবাইল থেকে দূরে, নিরাপদ পরিবেশ",
];

const comparison = [
    ["শুধু পড়িয়ে দেওয়া (passive)", "বিজ্ঞানভিত্তিক পদ্ধতিতে বুঝিয়ে শেখানো"],
    ["মাত্র ১–২ ঘণ্টা", "পূর্ণ ৬ ঘণ্টা তত্ত্বাবধান"],
    ["সবার জন্য একই নিয়ম", "প্রতিটি শিশুর জন্য আলাদা পরিকল্পনা"],
    ["ফলাফল ভাগ্যের ওপর", "নিয়মিত পরীক্ষিত অগ্রগতি"],
];

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
                <a href={waLink("আসসালামু আলাইকুম, আমি মোনতলা একাডেমিক কেয়ার সম্পর্কে জানতে চাই।")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:brightness-95">
                    <FaWhatsapp size={20} /> WhatsApp করুন
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">ফ্রি কাউন্সেলিং বুক করুন</h3>
            <p className="text-sm text-gray-500 -mt-2">নাম ও নম্বর দিন — আমরা কল করব। কোনো খরচ নেই।</p>
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
        <main className="overflow-x-hidden">
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
                        গতানুগতিক কোচিং নয় — <b className="text-white">মোনতলা একাডেমিক কেয়ার</b>-এ প্রতিদিন ৬ ঘণ্টার
                        বিজ্ঞানভিত্তিক শেখা, অভ্যাস ও যত্ন, সবটাই একসাথে।
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a href="#book" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
                            ফ্রি ৭ দিনের ট্রায়াল বুক করুন <LuArrowRight size={18} />
                        </a>
                        <a href={waLink("আসসালামু আলাইকুম, আমি মোনতলা একাডেমিক কেয়ার সম্পর্কে জানতে চাই।")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:brightness-95 transition">
                            <FaWhatsapp size={20} /> WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* Problem */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                        প্রতি মাসে টাকা যাচ্ছে, শিক্ষক আন্তরিকভাবে পড়াচ্ছেন, মাঝে মাঝে জিজ্ঞেস করছেন — “বুঝেছ?” সন্তান বলছে ‘জ্বি স্যার’।
                        এভাবেই চলছে বছরের পর বছর — তবু পরীক্ষার খাতা খুললে গল্পটা একই থেকে যায়।
                    </p>
                    <p className="mt-4 font-serif italic text-xl text-primary-700">পরিশ্রমে ঘাটতি নেই, ঘাটতি পদ্ধতিতে।</p>
                </div>
            </section>

            {/* Worries */}
            <section className="py-14 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">অভিভাবকের নীরব দুশ্চিন্তা</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {worries.map((w, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                                <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0"><LuTriangleAlert size={16} /></span>
                                <span className="text-gray-700">{w}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The real cause */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-3">আসল কারণ</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">দোষ সন্তানের মেধায় নয় — ভুলে যাওয়ায়।</h2>
                        <p className="text-gray-600 leading-relaxed">
                            আজ যা শেখে, পরীক্ষার দিন তার বেশিরভাগই হারিয়ে যায়। এটা অলসতা নয় — মস্তিষ্কের স্বাভাবিক নিয়ম, যাকে বলে
                            “ভুলে যাওয়ার বক্ররেখা”। সঠিক রিভিশন ছাড়া এটা ঠেকানো যায় না।
                        </p>
                    </div>
                    <div className="bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
                        <p className="text-6xl font-bold text-primary-700 tracking-tight">৭০%</p>
                        <p className="text-gray-700 mt-3">শেখা বিষয়ের প্রায় ৭০% সন্তান <b>২৪ ঘণ্টার মধ্যেই</b> ভুলে যায় — যদি রিভিশন না হয়।</p>
                    </div>
                </div>
            </section>

            {/* Solution */}
            <section className="py-16 px-6 bg-primary-700 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">সমাধান</p>
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
                        <p className="text-gray-500">এলোমেলো পড়া নয় — দিনের প্রতিটি ধাপ একটি প্রমাণিত পদ্ধতির ওপর সাজানো।</p>
                    </div>
                    <div className="space-y-3">
                        {routine.map((r, i) => {
                            const Icon = r.icon;
                            return (
                                <div key={i} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-5">
                                    <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Icon size={20} /></span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">{r.time}</span>
                                            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{r.tag}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900">{r.title}</h3>
                                        <p className="text-sm text-gray-600 mt-0.5">{r.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* The science */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">আমরা অনুমানে পড়াই না।</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">পড়াই বিশ্বের শীর্ষ বিশ্ববিদ্যালয়ের গবেষণায় প্রমাণিত ৫টি পদ্ধতিতে — যা সব বয়স ও সব বিষয়ে কাজ করে।</p>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-3">KENT STATE · DUKE · WASHINGTON UNIVERSITY</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                        {methods.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
                                    <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4"><Icon size={22} /></span>
                                    <h3 className="font-bold text-gray-900">{m.name}</h3>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{m.en}</p>
                                    <p className="text-sm text-gray-600 leading-relaxed flex-1">{m.desc}</p>
                                    <p className="mt-4 text-sm font-semibold text-primary-700 bg-primary-50 rounded-lg px-3 py-2">{m.stat}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Results + comparison */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">যে পরিবর্তন আপনি চোখে দেখবেন</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
                        {results.map((r, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                                <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0"><LuCheck size={15} /></span>
                                <span className="text-gray-700 text-sm">{r}</span>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 text-center mb-6">কেন গতানুগতিক কোচিং থেকে আলাদা</h3>
                    <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-2 bg-gray-50 text-sm font-bold text-gray-700">
                            <div className="px-5 py-3 border-r border-gray-200">সাধারণ কোচিং</div>
                            <div className="px-5 py-3 bg-primary-50/50 text-primary-800">মোনতলা একাডেমিক কেয়ার</div>
                        </div>
                        {comparison.map((row, i) => (
                            <div key={i} className="grid grid-cols-2 text-sm border-t border-gray-100">
                                <div className="px-5 py-4 border-r border-gray-200 text-gray-500">{row[0]}</div>
                                <div className="px-5 py-4 bg-primary-50/20 text-gray-800 font-medium">{row[1]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Offer + pricing */}
            <section className="py-16 px-6 bg-gray-50">
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
                    <p className="text-xs text-gray-400 mt-4">* প্যাকেজ ও বিষয়ভেদে ফি ভিন্ন হতে পারে · আসন সীমিত</p>
                </div>
            </section>

            {/* Booking / contact */}
            <section id="book" className="py-16 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-medium text-gray-900 mb-4">সন্তানের ভবিষ্যৎ — আর পিছিয়ে নয়।</h2>
                        <p className="text-gray-600 mb-6">আজই ফ্রি কাউন্সেলিং বুক করুন বা সরাসরি ভিজিট করুন।</p>
                        <a href={waLink("আসসালামু আলাইকুম, আমি ফ্রি ট্রায়াল বুক করতে চাই।")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:brightness-95 transition mb-8">
                            <FaWhatsapp size={20} /> WhatsApp: +{WA}
                        </a>
                        <div className="space-y-3 text-gray-700">
                            <p className="flex items-start gap-3"><LuMapPin className="text-primary-600 mt-1 shrink-0" size={18} /> {schoolInfo.academicCare.address}</p>
                            <p className="flex items-center gap-3"><LuMail className="text-primary-600 shrink-0" size={18} /> {schoolInfo.email}</p>
                        </div>
                    </div>
                    <LeadForm />
                </div>
            </section>
        </main>
    );
}
