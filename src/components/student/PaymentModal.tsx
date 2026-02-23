"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { PaymentRequestDto } from "@/types";
import { toast } from "react-toastify";
import { FaMobileAlt, FaMoneyBillWave, FaExchangeAlt } from "react-icons/fa";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    chapterId: number;
    chapterTitle: string;
    amount: number;
    onSubmit: (data: PaymentRequestDto) => Promise<void>;
}

export default function PaymentModal({
    isOpen,
    onClose,
    chapterId,
    chapterTitle,
    amount,
    onSubmit,
}: PaymentModalProps) {
    const [formData, setFormData] = useState<Omit<PaymentRequestDto, "chapterId" | "amount">>({
        transactionId: "",
        senderNumber: "",
        paymentMethod: "BKASH",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.senderNumber) newErrors.senderNumber = "Sender number is required";
        if (!formData.transactionId) newErrors.transactionId = "Transaction ID is required";

        // Simple BD phone number validation
        if (formData.senderNumber && !/^(01)[3-9][0-9]{8}$/.test(formData.senderNumber)) {
            newErrors.senderNumber = "Invalid phone number format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await onSubmit({
                chapterId,
                amount,
                ...formData,
            });
            // Success state handling is left to the parent's onSubmit implementation
        } catch (err: any) {
            console.error("Payment submission failed:", err);
            toast.error(err.response?.data?.message || "Failed to submit payment.");
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = [
        { value: "BKASH", label: "bKash" },
        // { value: "NAGAD", label: "Nagad" }, // TODO: Add this later on
        // { value: "ROCKET", label: "Rocket" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Your Payment" size="md">
            <div className="space-y-6 p-1">
                <div className="bg-primary-50 p-4 rounded-xl border border-primary-100">
                    <p className="text-sm text-primary-700 font-medium mb-1">Chapter</p>
                    <p className="text-lg font-bold text-primary-900">{chapterTitle}</p>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Amount:</span>
                        <span className="text-xl font-black text-primary-600">৳ {amount}</span>
                    </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 space-y-2">
                    <p className="text-xs font-bold text-yellow-800 uppercase tracking-widest">How to pay</p>
                    <p className="text-sm text-yellow-900">
                        1. Send <strong>৳ {amount}</strong> to our bKash Merchant number: <span className="font-bold underline">017XXXXXXXX</span>
                    </p>
                    <p className="text-sm text-yellow-900">
                        2. Copy the <strong>Transaction ID</strong> and enter it below along with your <strong>Sender Number</strong>.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        label="Payment Method"
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        options={paymentMethods}
                        required
                    />

                    <Input
                        label="Your bKash/Nagad Number"
                        placeholder="e.g. 01712345678"
                        value={formData.senderNumber}
                        onChange={(e) => setFormData({ ...formData, senderNumber: e.target.value })}
                        error={errors.senderNumber}
                        required
                    />

                    <Input
                        label="Transaction ID"
                        placeholder="e.g. TRX12345ABC"
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        error={errors.transactionId}
                        required
                    />

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            isLoading={loading}
                        >
                            Submit Payment
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
