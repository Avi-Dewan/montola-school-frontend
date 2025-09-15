const props = [
    { icon: "🎓", title: "Expert Teachers", desc: "Verified & experienced" },
    { icon: "📖", title: "Structured Learning", desc: "Chapter-based, interactive content" },
    { icon: "💰", title: "Affordable & Flexible", desc: "Buy per chapter or bundle" },
    { icon: "🌍", title: "Inclusive Education", desc: "Designed for Chittagong Hill Tracts & beyond" },
];

export default function ValueProps() {
    return (
        <section className="py-20 px-6 bg-white">
            <h2 className="text-3xl font-bold text-center mb-12">Why Montola?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {props.map((p) => (
                    <div key={p.title} className="text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
                        <div className="text-5xl mb-4">{p.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                        <p className="text-gray-600">{p.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
