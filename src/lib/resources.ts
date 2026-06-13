import { promises as fs } from "fs";
import path from "path";

export type ResourceEntry = {
    name: string;
    label: string;
    href: string;
    type: "directory" | "file";
};

export type ResourceDirectory = {
    type: "directory";
    title: string;
    slug: string[];
    entries: ResourceEntry[];
};

export type ResourceHtmlFile = {
    type: "file";
    title: string;
    slug: string[];
    html: string;
};

export type ResourceNode = ResourceDirectory | ResourceHtmlFile;

const RESOURCES_ROOT = path.join(process.cwd(), "resources");

function isSafeSegment(segment: string) {
    return segment !== "." && segment !== ".." && !segment.includes("/") && !segment.includes("\\");
}

function toTitle(value: string) {
    return value
        .replace(/\.html$/i, "")
        .split(/[-_]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ") || "Resources";
}

function toHref(slug: string[]) {
    return `/resources${slug.length ? `/${slug.map(encodeURIComponent).join("/")}` : ""}`;
}

async function pathExists(filePath: string) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

function resolveResourcePath(slug: string[]) {
    if (!slug.every(isSafeSegment)) {
        return null;
    }

    const resolved = path.resolve(RESOURCES_ROOT, ...slug);
    if (resolved !== RESOURCES_ROOT && !resolved.startsWith(`${RESOURCES_ROOT}${path.sep}`)) {
        return null;
    }

    return resolved;
}

export function getBreadcrumbs(slug: string[]) {
    return [
        { label: "Resources", href: "/resources" },
        ...slug.map((segment, index) => ({
            label: toTitle(segment),
            href: toHref(slug.slice(0, index + 1)),
        })),
    ];
}

export async function getResourceNode(slug: string[] = []): Promise<ResourceNode | null> {
    const resolvedPath = resolveResourcePath(slug);
    if (!resolvedPath) return null;

    let targetPath = resolvedPath;
    let targetSlug = slug;

    if (!(await pathExists(targetPath)) && !path.extname(targetPath)) {
        const htmlPath = `${targetPath}.html`;
        if (await pathExists(htmlPath)) {
            targetPath = htmlPath;
            targetSlug = [...slug.slice(0, -1), `${slug[slug.length - 1]}.html`];
        }
    }

    try {
        const stat = await fs.stat(targetPath);

        if (stat.isDirectory()) {
            const entries = await fs.readdir(targetPath, { withFileTypes: true });
            const visibleEntries = entries
                .filter((entry) => !entry.name.startsWith("."))
                .filter((entry) => entry.isDirectory() || (entry.isFile() && entry.name.toLowerCase().endsWith(".html")))
                .map<ResourceEntry>((entry) => {
                    const entrySlug = [...slug, entry.name];

                    return {
                        name: entry.name,
                        label: toTitle(entry.name),
                        href: toHref(entry.isFile() ? [...slug, entry.name.replace(/\.html$/i, "")] : entrySlug),
                        type: entry.isDirectory() ? "directory" : "file",
                    };
                })
                .sort((a, b) => {
                    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
                    return a.label.localeCompare(b.label);
                });

            return {
                type: "directory",
                title: slug.length ? toTitle(slug[slug.length - 1]) : "Resources",
                slug,
                entries: visibleEntries,
            };
        }

        if (stat.isFile() && targetPath.toLowerCase().endsWith(".html")) {
            return {
                type: "file",
                title: toTitle(path.basename(targetPath)),
                slug: targetSlug,
                html: await fs.readFile(targetPath, "utf8"),
            };
        }
    } catch {
        return null;
    }

    return null;
}
