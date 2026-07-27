"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nProvider";
import { getHighestPriorityRole } from "@/lib/roles";
import schoolInfo from "@/config/schoolInfo.json";
import { FaWhatsapp } from "react-icons/fa";
import { LuMail } from "react-icons/lu";

export default function Footer() {
    const { isLoggedIn, user, activeRole } = useAuth();
    const { t } = useI18n();

    const roles = user?.roles || [];
    const resolvedActiveRole =
        (activeRole && roles.includes(activeRole) && activeRole) ||
        getHighestPriorityRole(roles);

    const isStudent = resolvedActiveRole === "STUDENT";
    const isTeacher = resolvedActiveRole === "TEACHER";

    return (
        <footer className="bg-primary-700 text-white pt-16 pb-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
                {/* Brand */}
                <div className="lg:col-span-4 space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-full p-2.5 flex items-center justify-center shadow-lg ring-1 ring-white/20 shrink-0">
                            <img src="/montola-logo.png" alt="Montola School Logo" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-none">
                            Montola School
                        </h3>
                    </div>
                    <p className="font-serif italic text-lg text-primary-100/90 leading-relaxed max-w-sm">
                        {t("footer.description")}
                    </p>
                    <p className="text-sm text-primary-200/70 leading-relaxed max-w-sm">
                        {t("footer.blurb")}
                    </p>
                    <div className="flex gap-3 pt-1">
                        <a href={`https://wa.me/${schoolInfo.academicCare.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"
                            className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors">
                            <FaWhatsapp size={18} />
                        </a>
                        <a href={`mailto:${schoolInfo.email}`} aria-label="Email"
                            className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors">
                            <LuMail size={17} />
                        </a>
                    </div>
                </div>

                {/* Explore */}
                <div className="lg:col-span-3 space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-300">{t("footer.explore")}</h3>
                    <ul className="space-y-3">
                        <li><Link href="/classes" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.classes")}</Link></li>
                        <li><Link href="/featured-chapters" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.featuredChapters")}</Link></li>
                        <li><Link href="/free-chapters" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.freeChapters")}</Link></li>
                        <li><Link href="/shop" className="text-primary-100/90 hover:text-white transition-colors">Shop</Link></li>
                        <li><Link href="/academic-care" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.academicCare")}</Link></li>
                    </ul>
                </div>

                {/* Account */}
                <div className="lg:col-span-2 space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-300">{t("footer.account")}</h3>
                    <ul className="space-y-3">
                        {!isLoggedIn && (
                            <>
                                <li><Link href="/auth/login" className="text-primary-100/90 hover:text-white transition-colors">{t("auth.login")}</Link></li>
                                <li><Link href="/auth/register" className="text-primary-100/90 hover:text-white transition-colors">{t("auth.register")}</Link></li>
                            </>
                        )}
                        {isLoggedIn && isStudent && (
                            <>
                                <li><Link href="/student/dashboard" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.myDashboard")}</Link></li>
                                <li><Link href="/student/profile" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.myProfile")}</Link></li>
                            </>
                        )}
                        {isLoggedIn && isTeacher && (
                            <>
                                <li><Link href="/teacher" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.myDashboard")}</Link></li>
                                <li><Link href="/teacher/assigned-chapters" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.assignedChapters")}</Link></li>
                                <li><Link href="/teacher/profile" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.myProfile")}</Link></li>
                            </>
                        )}
                        <li><Link href="/support" className="text-primary-100/90 hover:text-white transition-colors">{t("nav.support")}</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="lg:col-span-3 space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-300">{t("footer.contact")}</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-300/80">{t("footer.email")}</span>
                            <a href={`mailto:${schoolInfo.email}`} className="text-sm font-medium text-white hover:text-primary-200 transition-colors break-all">{schoolInfo.email}</a>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-300/80">{t("footer.phone")}</span>
                            <a href={`tel:${schoolInfo.phone}`} className="text-sm font-medium text-white hover:text-primary-200 transition-colors">{schoolInfo.phone}</a>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-300/80">{t("footer.address")}</span>
                            <span className="text-sm font-medium text-white">{schoolInfo.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-sm text-primary-200/70">
                    <p>© {schoolInfo.copyrightYear} Montola School. {t("footer.rights")}</p>
                    <span className="hidden sm:inline text-primary-200/30">·</span>
                    <div className="flex gap-6">
                        <Link href="/" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
