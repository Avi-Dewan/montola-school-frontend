import Link from "next/link";
import { notFound } from "next/navigation";
import { FiChevronRight, FiFileText, FiFolder, FiArrowUp } from "react-icons/fi";
import { getBreadcrumbs, getResourceNode } from "@/lib/resources";

type ResourcesPageProps = {
    params: Promise<{
        slug?: string[];
    }>;
};

export default async function ResourcesPage({ params }: ResourcesPageProps) {
    const { slug = [] } = await params;
    const node = await getResourceNode(slug);

    if (!node) {
        notFound();
    }

    const breadcrumbs = getBreadcrumbs(node.slug);
    const parentHref = node.slug.length > 0
        ? `/resources/${node.slug.slice(0, -1).map(encodeURIComponent).join("/")}`
        : null;

    return (
        <div className="min-h-screen bg-white">
            <div className="border-b border-gray-200 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-600" aria-label="Resource navigation">
                        {breadcrumbs.map((item, index) => (
                            <div key={item.href} className="flex items-center gap-2">
                                {index > 0 && <FiChevronRight className="text-gray-400" size={16} />}
                                {index === breadcrumbs.length - 1 ? (
                                    <span className="font-semibold text-gray-900">{item.label}</span>
                                ) : (
                                    <Link href={item.href} className="font-medium hover:text-primary-600 transition-colors">
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {node.type === "directory" ? (
                <section className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{node.title}</h1>
                            <p className="text-gray-500 mt-2">Browse folders and open HTML lessons from this resource library.</p>
                        </div>
                        {parentHref && (
                            <Link
                                href={parentHref}
                                className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700"
                            >
                                <FiArrowUp size={16} />
                                Back
                            </Link>
                        )}
                    </div>

                    {node.entries.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {node.entries.map((entry) => (
                                <Link
                                    key={`${entry.type}-${entry.name}`}
                                    href={entry.href}
                                    className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-primary-200 hover:shadow-md transition"
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                                        {entry.type === "directory" ? <FiFolder size={22} /> : <FiFileText size={22} />}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate font-bold text-gray-900 group-hover:text-primary-600">
                                            {entry.label}
                                        </span>
                                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                            {entry.type === "directory" ? "Folder" : "HTML"}
                                        </span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
                            No HTML files or folders found here yet.
                        </div>
                    )}
                </section>
            ) : (
                <section className="bg-white">
                    <iframe
                        srcDoc={node.html}
                        title={node.title}
                        className="block w-full min-h-screen border-0"
                        sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
                    />
                </section>
            )}
        </div>
    );
}
