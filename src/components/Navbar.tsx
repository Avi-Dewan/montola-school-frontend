"use client";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
                <div className="text-2xl font-bold text-primary-500">Montola School</div>
                <div className="flex space-x-6 items-center">
                    <Link href="/" className="hover:text-primary-500">Home</Link>
                    <Link href="/courses" className="hover:text-primary-500">Courses</Link>
                    <Link href="/teachers" className="hover:text-primary-500">Teachers</Link>
                    <Link href="/pricing" className="hover:text-primary-500">Pricing</Link>
                    <Link href="/about" className="hover:text-primary-500">About Us</Link>
                    <Link href="/auth/login" className="ml-4 px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition">
                        Sign In
                    </Link>
                </div>
            </div>
        </nav>
    );
}
