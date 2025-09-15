const courses = [
    { subject: "Mathematics", teacher: "Mr. Rahman", price: "৳500" },
    { subject: "Physics", teacher: "Ms. Akter", price: "৳450" },
    { subject: "English", teacher: "Mr. Karim", price: "৳400" },
];

export default function FeaturedCourses() {
    return (
        <section className="py-20 px-6 bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {courses.map((c) => (
                    <div key={c.subject} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-2">{c.subject}</h3>
                        <p className="text-gray-700 mb-4">Teacher: {c.teacher}</p>
                        <p className="text-green-600 font-semibold mb-4">{c.price}</p>
                        <button className="w-full py-2 px-4 bg-primary-500 text-white rounded hover:bg-primary-600 transition">
                            Preview
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
