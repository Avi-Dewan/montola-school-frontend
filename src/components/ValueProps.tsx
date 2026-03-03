import { useI18n } from "@/contexts/I18nProvider";

export default function ValueProps() {
    const { t } = useI18n();

    const props = [
        {
            icon: "🎓",
            title: t("home.valueProps.props.teachers.title"),
            desc: t("home.valueProps.props.teachers.desc"),
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: "📖",
            title: t("home.valueProps.props.learning.title"),
            desc: t("home.valueProps.props.learning.desc"),
            color: "bg-green-50 text-green-600"
        },
        {
            icon: "💰",
            title: t("home.valueProps.props.affordable.title"),
            desc: t("home.valueProps.props.affordable.desc"),
            color: "bg-purple-50 text-purple-600"
        },
        {
            icon: "🌍",
            title: t("home.valueProps.props.inclusive.title"),
            desc: t("home.valueProps.props.inclusive.desc"),
            color: "bg-amber-50 text-amber-600"
        },
    ];

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        {t("home.valueProps.titlePart1")}<span className="text-primary-600">{t("home.valueProps.titlePart2")}</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        {t("home.valueProps.description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {props.map((p) => (
                        <div
                            key={p.title}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className={`w-16 h-16 ${p.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {p.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{p.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {p.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
