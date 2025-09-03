"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { activateAccount, resendActivationToken } from "@/lib/auth";

export default function ActivatePage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const [message, setMessage] = useState("Activating your account...");
    const [showResend, setShowResend] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const activate = async () => {
            try {
                await activateAccount(email, token);

                setMessage("✅ Account activated successfully! Redirecting to login...");
                setTimeout(() => router.push("/auth/login"), 2000);

            } catch (err: any) {
                console.log("Error response:", err?.response?.data);

                const errorData = err?.response?.data;
                const status = errorData?.status;
                const msg = errorData?.message;

                if (status === 400 && msg === "Verification token expired") {
                    setMessage("⏳ Activation token expired. You can resend the activation link.");
                    setShowResend(true);

                } else if (status === 409 && msg === "No verification token found") {
                    setMessage("⚠️ No verification token found. Please register again.");
                    setShowRegister(true);

                } else if (status === 409 && msg === "User is already verified") {
                    setMessage("ℹ️ Account already activated. Redirecting to login...");
                    setTimeout(() => router.push("/auth/login"), 2000);

                } else {
                    setMessage(msg || "❌ Activation failed. Please try again.");
                }
            }
        };
        activate();
    }, [email, token, router]);

    const handleResend = async () => {
        try {
            await resendActivationToken(email);
            router.push("/auth/check-email?email=" + encodeURIComponent(email));
        } catch (err) {
            setMessage("❌ Failed to resend token. Please try again later.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">

                <p className="mb-4">{message}</p>

                {showResend && (
                    <button
                        onClick={handleResend}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Resend Activation Link
                    </button>
                )}

                {showRegister && (
                    <button
                        onClick={() => router.push("/auth/register")}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Go to Register
                    </button>
                )}

            </div>
        </div>
    );
}