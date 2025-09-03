"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Example: check if JWT exists in localStorage
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);

    }, []);

    const handleLogout = async () => {
        await logout();
        setIsLoggedIn(false);
        router.push("/auth/login");
    };

    return (
        <nav className="sticky top-0 bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
                <div className="text-2xl font-bold text-primary-500">
                    Montola School
                </div>

                <div className="flex space-x-6 items-center">
                    <Link href="/" className="hover:text-primary-500">Home</Link>
                    <Link href="/courses" className="hover:text-primary-500">Courses</Link>
                    <Link href="/teachers" className="hover:text-primary-500">Teachers</Link>
                    <Link href="/pricing" className="hover:text-primary-500">Pricing</Link>
                    <Link href="/about" className="hover:text-primary-500">About Us</Link>

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex space-x-3">
                            <Link
                                href="/auth/login"
                                className="px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}