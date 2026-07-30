"use client";

import { FaGraduationCap } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";
import ClassLevelGroups from "@/components/classes/ClassLevelGroups";
import { useI18n } from "@/contexts/I18nProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useClassesWithMeta } from "@/lib/classGroups";

export default function ClassesPage() {
    const { t } = useI18n();
    const { isLoggedIn, user } = useAuth();
    const isStudent = !!user?.roles?.includes("STUDENT");

    const { classes, meta, groups, loading, error } = useClassesWithMeta(isLoggedIn, isStudent);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <LoadingSpinner label={t("classes.loading")} size="lg" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        {t("classes.title")}
                    </h1>
                    <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">
                        {t("classes.subtitle")}
                    </p>
                </header>

                {error ? (
                    <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl text-center max-w-md mx-auto">
                        {t("classes.error")}
                    </div>
                ) : classes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <FaGraduationCap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t("classes.noClasses")}</h3>
                        <p className="text-gray-500">{t("classes.noClassesSub")}</p>
                    </div>
                ) : (
                    <ClassLevelGroups groups={groups} meta={meta} />
                )}
            </div>
        </main>
    );
}
