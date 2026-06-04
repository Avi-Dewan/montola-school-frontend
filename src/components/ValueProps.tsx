import { useI18n } from "@/contexts/I18nProvider";
import { FaLightbulb, FaUserGraduate, FaComments } from "react-icons/fa";

export default function ValueProps() {
    const { t } = useI18n();

    const props = [
        {
            icon: <FaLightbulb size={24} />,
            title: t("home.valueProps.props.why.title"),
            desc: t("home.valueProps.props.why.desc"),
            color: "bg-amber-50 text-amber-500"
        },
        {
            icon: <FaUserGraduate size={24} />,
            title: t("home.valueProps.props.personalized.title"),
            desc: t("home.valueProps.props.personalized.desc"),
            color: "bg-primary-50 text-primary-600"
        },
        {
            icon: <FaComments size={24} />,
            title: t("home.valueProps.props.reciprocal.title"),
            desc: t("home.valueProps.props.reciprocal.desc"),
            color: "bg-blue-50 text-blue-500"
        }
    ];

    const comparisonRows = [
        { left: t("home.valueProps.comparison.row1.left"), right: t("home.valueProps.comparison.row1.right") },
        { left: t("home.valueProps.comparison.row2.left"), right: t("home.valueProps.comparison.row2.right") },
        { left: t("home.valueProps.comparison.row3.left"), right: t("home.valueProps.comparison.row3.right") },
    ];

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        {t("home.valueProps.titlePart1")}<span className="text-primary-600">{t("home.valueProps.titlePart2")}</span>
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                        {t("home.valueProps.descriptionPart1")}
                        <span className="font-bold text-gray-900">{t("home.valueProps.descriptionPart2")}</span>
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
                        {props.map((p) => (
                            <div
                                key={p.title}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
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

                {/* Comparison Table */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <h3 className="text-center text-2xl font-bold text-gray-900 mb-8">
                        What sets us apart
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        {/* Header */}
                        <div className="grid grid-cols-2">
                            <div className="px-8 py-5 border-b border-r border-gray-200">
                                <h3 className="font-bold text-gray-900 text-sm md:text-base">
                                    {t("home.valueProps.comparison.conventional")}
                                </h3>
                            </div>
                            <div className="px-8 py-5 border-b border-gray-200 bg-primary-50/40">
                                <h3 className="font-bold text-gray-900 text-sm md:text-base">
                                    {t("home.valueProps.comparison.montola")}
                                </h3>
                            </div>
                        </div>
                        {/* Rows */}
                        {comparisonRows.map((row, i) => (
                            <div key={i} className={`grid grid-cols-2 ${i < comparisonRows.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <div className="px-8 py-6 border-r border-gray-200">
                                    <p className="text-gray-500 text-sm leading-relaxed">{row.left}</p>
                                </div>
                                <div className="px-8 py-6 bg-primary-50/20">
                                    <p className="text-gray-700 text-sm leading-relaxed font-medium">{row.right}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
