"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // optional
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"ADMIN" | "STUDENT">("STUDENT");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            res = await register(email, password, [role], phone || null);

            console.log(res)

            router.push("/auth/check-email?email=" + encodeURIComponent(email));

        } catch (err: any) {

            setErrors({ general: "Failed to register" });

            console.log(err)

            const data = err?.response?.data;

            if (data?.fieldErrors) {
                setErrors(data.fieldErrors);

            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white shadow-lg p-8 rounded-xl w-96" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold mb-6">Register</h1>

                {errors.general && <p className="text-red-500 mb-3">{errors.general}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                    required
                />
                {errors.email && <p className="text-red-500 mb-2">{errors.email}</p>}

                <input
                    type="text"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                />
                {errors.phone && <p className="text-red-500 mb-2">{errors.phone}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                    required
                />
                {errors.password && <p className="text-red-500 mb-2">{errors.password}</p>}

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full mb-4 p-2 border rounded"
                >
                    <option value="STUDENT">Student</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
