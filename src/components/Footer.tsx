import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-primary-700 text-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="font-bold mb-4">Montola School</h3>
                    <p>Eco-friendly EdTech for Chittagong Hill Tracts & beyond.</p>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Quick Links</h3>
                    <ul>
                        <li><Link href="/courses">Courses</Link></li>
                        <li><Link href="/teachers">Teachers</Link></li>
                        <li><Link href="/support">Support</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Contact</h3>
                    <p>Email: info@montolaschool.com</p>
                    <p>Phone: +880 123 456 789</p>
                    <p>Address: Chittagong Hill Tracts, Bangladesh</p>
                </div>
            </div>
            <p className="text-center mt-8 text-gray-300">© Montola School 2025 – All rights reserved.</p>
        </footer>
    );
}
