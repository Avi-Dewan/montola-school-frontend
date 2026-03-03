import React from 'react';

interface ChapterPlaceholderProps {
    title: string;
    subjectName?: string;
    className?: string;
    variant?: 'full' | 'thumbnail';
}

const gradients = [
    'from-indigo-600 to-blue-700',
    'from-slate-700 to-indigo-900',
    'from-blue-600 to-cyan-700',
    'from-indigo-500 to-purple-600',
    'from-slate-600 to-blue-800',
    'from-cyan-600 to-indigo-700',
];

const ChapterPlaceholder: React.FC<ChapterPlaceholderProps> = ({
    title,
    subjectName,
    className = "",
    variant = "full"
}) => {
    // Stable "random" index based on title length and character codes
    const index = (title.length + title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % gradients.length;
    const gradient = gradients[index];

    if (variant === 'thumbnail') {
        const initials = title
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        return (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient} text-white font-black select-none ${className}`}>
                <span className="text-[10px] tracking-tighter transform scale-90">
                    {initials}
                </span>
                <div className="absolute inset-0 bg-black/10"></div>
            </div>
        );
    }

    return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br ${gradient} text-white selection:bg-white/20 ${className}`}>
            <div className="text-center transform transition-transform group-hover:scale-105 duration-500">
                {subjectName && (
                    <p className="text-white/70 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-3 drop-shadow-sm">
                        {subjectName}
                    </p>
                )}
                <h3 className="text-2xl md:text-4xl font-black uppercase leading-[1.1] tracking-tighter drop-shadow-md">
                    {title}
                </h3>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/10">
                <div className="w-1/3 h-full bg-white/30 animate-pulse"></div>
            </div>

            {/* Abstract Decorative Elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/5 rounded-full blur-3xl"></div>

            {/* Subtle Brand Watermark */}
            <img
                src="/montola-logo.png"
                alt=""
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 object-contain opacity-[0.04] pointer-events-none grayscale invert contrast-150 transition-transform duration-700 group-hover:scale-110"
            />
        </div>
    );
};

export default ChapterPlaceholder;
