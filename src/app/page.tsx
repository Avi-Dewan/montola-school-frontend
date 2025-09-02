import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import FeaturedCourses from "@/components/FeaturedCourses";
import TeacherSpotlight from "@/components/TeacherSpotLight";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function HomePage() {
    return (
        <main>
            <Hero />
            <ValueProps />
            <FeaturedCourses />
            <TeacherSpotlight />
            <Testimonials />
            <Pricing />
        </main>
    );
}
