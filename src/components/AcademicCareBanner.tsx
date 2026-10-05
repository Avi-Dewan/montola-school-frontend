import Link from "next/link";
import { LuMapPin, LuArrowRight, LuClock, LuBadgeCheck } from "react-icons/lu";

// Homepage promo for the offline Academic Care programme (Khagrachari).
export default function AcademicCareBanner() {
    return (
        <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 to-primary-800 text-white p-8 md:p-12">
                    <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
                        <LuMapPin size={14} /> খাগড়াছড়ি · অফলাইন
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-medium max-w-2xl leading-tight mb-4">
                        মোনতলা একাডেমিক কেয়ার — প্রতিদিন ৬ ঘণ্টার বিজ্ঞানভিত্তিক যত্ন
                    </h2>
                    <p className="text-white/85 text-lg max-w-2xl mb-6">
                        গতানুগতিক কোচিং নয়। স্কুলের পর সরাসরি তত্ত্বাবধানে শেখা, অভ্যাস ও যত্ন — যাতে সন্তান মুখস্থ নয়, সত্যিই শেখে।
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-sm text-white/90">
                        <span className="inline-flex items-center gap-2"><LuBadgeCheck size={16} /> প্রথম ৭ দিন ফ্রি ট্রায়াল</span>
                        <span className="inline-flex items-center gap-2"><LuClock size={16} /> প্রতিদিন ৬ ঘণ্টা</span>
                        <span className="inline-flex items-center gap-2"><LuBadgeCheck size={16} /> Class 6–10 · আসন সীমিত</span>
                    </div>
                    <Link href="/academic-care" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
                        বিস্তারিত দেখুন ও বুক করুন <LuArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
