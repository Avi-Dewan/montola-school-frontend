"use client";

import { useState, useEffect } from "react";
import { QuizRequestDto, QuizType, QuizQuestionRequestDto, QuizQuestionType } from "@/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { HiPlus, HiTrash } from "react-icons/hi";

interface QuizFormProps {
    topicId: number;
    initialData?: any; // Content response from API
    onSubmit: (data: QuizRequestDto) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function QuizForm({
    topicId,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: QuizFormProps) {
    const [formData, setFormData] = useState<QuizRequestDto>({
        topicId: topicId,
        title: initialData?.title || "",
        quizType: initialData?.quizType || QuizType.MCQ,
        instruction: initialData?.instruction || "",
        timeLimit: initialData?.timeLimit || undefined,
        totalMarks: initialData?.totalMarks || undefined,
        passPercentage: initialData?.passPercentage || undefined,
        orderIndex: initialData?.orderIndex || 0,
        questions: initialData?.questions || [],
    });
    const [errors, setErrors] = useState<{ title?: string }>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                topicId: topicId,
                title: initialData.title || "",
                quizType: initialData.quizType || QuizType.MCQ,
                instruction: initialData.instruction || "",
                timeLimit: initialData.timeLimit || undefined,
                totalMarks: initialData.totalMarks || undefined,
                passPercentage: initialData.passPercentage || undefined,
                orderIndex: initialData.orderIndex || 0,
                questions: initialData.questions || [],
            });
        }
    }, [initialData, topicId]);

    const validate = (): boolean => {
        const newErrors: { title?: string } = {};

        if (!formData.title || formData.title.trim().length === 0) {
            newErrors.title = "Quiz title is required";
        } else if (formData.title.length > 200) {
            newErrors.title = "Quiz title must be less than 200 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSubmit(formData);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save quiz");
        }
    };

    const addQuestion = () => {
        const newQuestion: QuizQuestionRequestDto = {
            questionText: "",
            type: QuizQuestionType.MULTIPLE_CHOICE,
            orderIndex: (formData.questions?.length || 0) + 1,
            marks: 1,
            options: [{ optionText: "", correct: false }],
        };
        setFormData({
            ...formData,
            questions: [...(formData.questions || []), newQuestion],
        });
    };

    const removeQuestion = (index: number) => {
        const newQuestions = formData.questions?.filter((_, i) => i !== index) || [];
        setFormData({ ...formData, questions: newQuestions });
    };

    const updateQuestion = (index: number, field: keyof QuizQuestionRequestDto, value: any) => {
        const newQuestions = [...(formData.questions || [])];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setFormData({ ...formData, questions: newQuestions });
    };

    const addOption = (questionIndex: number) => {
        const newQuestions = [...(formData.questions || [])];
        if (!newQuestions[questionIndex].options) {
            newQuestions[questionIndex].options = [];
        }
        newQuestions[questionIndex].options?.push({ optionText: "", correct: false });
        setFormData({ ...formData, questions: newQuestions });
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const newQuestions = [...(formData.questions || [])];
        newQuestions[questionIndex].options = newQuestions[questionIndex].options?.filter(
            (_, i) => i !== optionIndex
        );
        setFormData({ ...formData, questions: newQuestions });
    };

    const updateOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
        const newQuestions = [...(formData.questions || [])];
        if (newQuestions[questionIndex].options) {
            newQuestions[questionIndex].options![optionIndex] = {
                ...newQuestions[questionIndex].options![optionIndex],
                [field]: value,
            };
        }
        setFormData({ ...formData, questions: newQuestions });
    };

    const quizTypeOptions = [
        { value: QuizType.MCQ, label: "Multiple Choice (MCQ)" },
        { value: QuizType.WRITTEN, label: "Written" },
        { value: QuizType.FILL_BLANK, label: "Fill in the Blank" },
        { value: QuizType.TABLE_MATCHING, label: "Table Matching" },
    ];

    const questionTypeOptions = [
        { value: QuizQuestionType.MULTIPLE_CHOICE, label: "Multiple Choice" },
        { value: QuizQuestionType.FILL_IN_THE_BLANK, label: "Fill in the Blank" },
        { value: QuizQuestionType.MATCHING, label: "Matching" },
        { value: QuizQuestionType.WRITTEN, label: "Written" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                label="Quiz Title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
                maxLength={200}
                placeholder="Enter quiz title"
            />

            <Select
                label="Quiz Type"
                required
                value={formData.quizType}
                onChange={(e) => setFormData({ ...formData, quizType: e.target.value as QuizType })}
                options={quizTypeOptions}
            />

            <div>
                <label className="block mb-1 font-semibold text-gray-700">
                    Instructions
                </label>
                <textarea
                    value={formData.instruction || ""}
                    onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter quiz instructions (optional)"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Time Limit (minutes)"
                    type="number"
                    value={formData.timeLimit?.toString() || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            timeLimit: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                    }
                    placeholder="Time limit (optional)"
                />

                <Input
                    label="Total Marks"
                    type="number"
                    value={formData.totalMarks?.toString() || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            totalMarks: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                    }
                    placeholder="Total marks (optional)"
                />

                <Input
                    label="Pass Percentage"
                    type="number"
                    step="0.1"
                    value={formData.passPercentage?.toString() || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            passPercentage: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                    }
                    placeholder="Pass % (optional)"
                />
            </div>

            <Input
                label="Order Index"
                type="number"
                required
                value={formData.orderIndex.toString()}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        orderIndex: parseInt(e.target.value) || 0,
                    })
                }
                placeholder="Order index"
            />

            {/* Questions Section */}
            <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addQuestion}
                    >
                        <HiPlus className="w-4 h-4 inline-block mr-1" />
                        Add Question
                    </Button>
                </div>

                {formData.questions && formData.questions.length > 0 ? (
                    <div className="space-y-6">
                        {formData.questions.map((question, qIndex) => (
                            <div
                                key={qIndex}
                                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h4 className="font-medium text-gray-800">
                                        Question {qIndex + 1}
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeQuestion(qIndex)}
                                    >
                                        <HiTrash className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        label="Question Text"
                                        required
                                        value={question.questionText}
                                        onChange={(e) =>
                                            updateQuestion(qIndex, "questionText", e.target.value)
                                        }
                                        placeholder="Enter question text"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            label="Question Type"
                                            required
                                            value={question.type}
                                            onChange={(e) =>
                                                updateQuestion(
                                                    qIndex,
                                                    "type",
                                                    e.target.value as QuizQuestionType
                                                )
                                            }
                                            options={questionTypeOptions}
                                        />

                                        <Input
                                            label="Marks"
                                            type="number"
                                            required
                                            value={question.marks.toString()}
                                            onChange={(e) =>
                                                updateQuestion(
                                                    qIndex,
                                                    "marks",
                                                    parseInt(e.target.value) || 1
                                                )
                                            }
                                            placeholder="Marks"
                                        />
                                    </div>

                                    {/* Options for Multiple Choice */}
                                    {question.type === QuizQuestionType.MULTIPLE_CHOICE && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block font-semibold text-gray-700">
                                                    Options
                                                </label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addOption(qIndex)}
                                                >
                                                    <HiPlus className="w-4 h-4 inline-block mr-1" />
                                                    Add Option
                                                </Button>
                                            </div>
                                            {question.options && question.options.length > 0 ? (
                                                <div className="space-y-2">
                                                    {question.options.map((option, oIndex) => (
                                                        <div
                                                            key={oIndex}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Input
                                                                value={option.optionText}
                                                                onChange={(e) =>
                                                                    updateOption(
                                                                        qIndex,
                                                                        oIndex,
                                                                        "optionText",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Option text"
                                                                className="flex-1"
                                                            />
                                                            <label className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={option.correct}
                                                                    onChange={(e) =>
                                                                        updateOption(
                                                                            qIndex,
                                                                            oIndex,
                                                                            "correct",
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 text-primary-600"
                                                                />
                                                                <span className="text-sm text-gray-700">
                                                                    Correct
                                                                </span>
                                                            </label>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeOption(qIndex, oIndex)}
                                                            >
                                                                <HiTrash className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    No options added yet
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">
                        No questions added yet. Click "Add Question" to get started.
                    </p>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? "Update Quiz" : "Create Quiz"}
                </Button>
            </div>
        </form>
    );
}
