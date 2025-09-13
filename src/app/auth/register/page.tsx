"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import { useI18n } from "@/contexts/I18nProvider";
import { Alert } from "@/components/Alert";
import { toast } from "react-toastify";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // optional
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"ADMIN" | "STUDENT">("STUDENT");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { t } = useI18n();

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = t("auth.invalidEmail");
        }

        if (!password.match(/^(?=.*[A-Za-z])(?=.*\d).{5,}$/)) {
            newErrors.password = t("auth.passwordPolicy");
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = t("auth.passwordMismatch");
        }

        if (phone) {
            if (!/^01\d{9}$/.test(phone)) {
                newErrors.phone = t("auth.invalidPhone");
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            return;
        }

        setLoading(true);

        try {
            const res = await register(email, password, [role], phone || null);
            console.log(res)

            toast.success(t("auth.registrationSuccess"));
            router.push("/auth/check-email?email=" + encodeURIComponent(email));

        } catch (err: any) {
            console.log(err);
            const data = err?.response?.data;

            if (data?.status === 409 && data?.message?.includes("already exists")) {
                // email already registered
                setErrors({
                    email: t("auth.emailExists"),
                    general: t("auth.alreadyRegistered")
                });

            } else if (data?.fieldErrors) {
                setErrors(data.fieldErrors);

            } else {
                setErrors({ general: t("auth.registrationFailed") });
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white shadow-lg p-8 rounded-xl w-96" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold mb-6">Register</h1>

                {errors.general && <Alert type="error" message={errors.general} />}

                {/* Email */}
                <label className="block mb-1 font-semibold">
                    {t("form.user.email")} <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={email}
                    placeholder={t("form.user.emailPlaceholder")}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                    required
                />
                {errors.email && <p className="text-red-500 mb-2">{errors.email}</p>}

                {/* Phone (optional) */}
                <label className="block mb-1 font-semibold">
                    {t("form.user.phone")}
                </label>
                <input
                    type="text"
                    value={phone}
                    placeholder={t("form.user.phonePlaceholder")}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                />
                {errors.phone && <p className="text-red-500 mb-2">{errors.phone}</p>}

                {/* Password */}
                <label className="block mb-1 font-semibold">
                    {t("form.user.password")} <span className="text-red-500">*</span>
                </label>
                <input
                    type="password"
                    value={password}
                    placeholder={t("form.user.passwordPlaceholder")}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                    required
                />
                {errors.password && <p className="text-red-500 mb-2">{errors.password}</p>}

                {/* Confirm Password */}
                <label className="block mb-1 font-semibold">
                    {t("form.user.confirmPassword")} <span className="text-red-500">*</span>
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    placeholder={t("form.user.confirmPasswordPlaceholder")}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                    required
                />
                {errors.confirmPassword && <p className="text-red-500 mb-2">{errors.confirmPassword}</p>}

                {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-red-500 mb-2">{t("auth.passwordMismatch")}</p>
                )}

                {/* Role */}
                <label className="block mb-1 font-semibold">
                    {t("form.user.role")} <span className="text-red-500">*</span>
                </label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full mb-4 p-2 border rounded"
                >
                    <option value="STUDENT">{t("roles.student")}</option>
                    <option value="TEACHER">{t("roles.teacher")}</option>
                    <option value="MANAGER">{t("roles.manager")}</option>
                    <option value="ADMIN">{t("roles.admin")}</option>
                </select>
                {errors.role && <p className="text-red-500 mb-2">{errors.role}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"}`}
                >
                    {loading ? t("messages.loading") : t("auth.register")}
                </button>
            </form>
        </div>
    );
}
