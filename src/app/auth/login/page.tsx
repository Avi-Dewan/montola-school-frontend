"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { useI18n } from "@/contexts/I18nProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "@/components/Alert";
import { toast } from "react-toastify";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { t } = useI18n();
    const { setAuthTokens } = useAuth();

    // simple validation before submit
    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = t("form.user.email") + " is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = t("form.user.email") + " is invalid";
        }

        if (!password) {
            newErrors.password = t("form.user.password") + " is required";

        } else if (!/^(?=.*[A-Za-z])(?=.*\d).{5,}$/.test(password)) {
            newErrors.password = t("auth.passwordPolicy");
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        setErrors({});

        try {
            const res = await login(email, password);

            setAuthTokens({
                accessToken: res.data.token,
                refreshToken: res.data.refreshToken || res.data.token // Adjust based on your API response
            });

            toast.success(t("auth.loginSuccess"));
            router.push("/dashboard");

        } catch (err) {
            console.error(err);
            setErrors({ general: t("auth.invalidCredentials") });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg p-8 rounded-xl w-96"
            >
                <h1 className="text-2xl font-bold mb-6">{t("auth.login")}</h1>

                {errors.general && <Alert type="error" message={errors.general} />}

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">
                        {t("form.user.email")} <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="email"
                        placeholder={t("form.user.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">
                        {t("form.user.password")} <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="password"
                        placeholder={t("form.user.passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${
                        loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? t("messages.loading") : t("auth.login")}
                </button>
            </form>
        </div>
    );
}
