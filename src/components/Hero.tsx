import { useI18n } from "@/contexts/I18nProvider";

export default function Hero() {
    const { t } = useI18n();

    return (
        <section className="bg-gradient-to-r from-primary-400 to-primary-500 text-white py-32 px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t("home.hero.title")}
            </h1>
            <p className="text-lg md:text-xl mb-8">
                {t("home.hero.subtitle")}
            </p>
            <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-white text-primary-500 rounded-lg font-semibold hover:bg-gray-100 transition">
                    {t("home.hero.startLearning")}
                </button>
                <button className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition">
                    {t("home.hero.exploreCourses")}
                </button>
            </div>
        </section>
    );
}
