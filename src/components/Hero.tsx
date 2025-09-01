export default function Hero() {
    return (
        <section className="bg-gradient-to-r from-primary-400 to-primary-500 text-white py-32 px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                From Zero to Infinity – Unlock Your Learning Journey
            </h1>
            <p className="text-lg md:text-xl mb-8">
                Interactive, affordable, and structured education for Class 6–HSC students.
            </p>
            <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-white text-primary-500 rounded-lg font-semibold hover:bg-gray-100 transition">
                    Start Learning
                </button>
                <button className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition">
                    Explore Courses
                </button>
            </div>
        </section>
    );
}
