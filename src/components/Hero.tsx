import { useI18n } from "@/contexts/I18nProvider";
import Link from "next/link";

export default function Hero() {
    const { t } = useI18n();

    return (
        <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20 md:py-32 px-6 text-center">
            {/* White container for brand visibility on green background */}
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 bg-white rounded-full flex items-center justify-center shadow-2xl p-4 animate-in fade-in zoom-in duration-700 ring-4 ring-white/30">
                <img
                    src="/montola-logo.png"
                    alt="Montola School Logo"
                    className="w-full h-full object-contain"
                />
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-medium mb-5 md:mb-6 tracking-tight">
                {t("home.hero.title")}
            </h1>
            <p className="text-base md:text-xl mb-8 md:mb-10 text-white/85 max-w-2xl mx-auto leading-relaxed">
                {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
                <Link href="/classes" className="px-6 py-3 bg-white text-primary-500 rounded-lg font-semibold hover:bg-gray-100 transition">
                    {t("home.hero.startLearning")}
                </Link>
                <Link href="/shop" className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition">
                    {t("home.hero.studyMaterials")}
                </Link>
            </div>
        </section>
    );
}
