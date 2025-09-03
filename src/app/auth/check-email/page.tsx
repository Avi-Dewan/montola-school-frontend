"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function CheckEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const email = searchParams.get("email");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">

                <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>

                <p className="mb-4">
                    A verification link has been sent to <strong>{email}</strong>. Please verify within 15 minutes.
                </p>
                <button
                    onClick={() => router.push("/auth/login")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}
