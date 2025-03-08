import { notFound } from "next/navigation";
import Link from "next/link";
import notesData from "@/data/tasting-notes-wheel.json"; // Import directly

interface NotesData {
    [key: string]: NotesData | string[] | null;
}

export default function NotesPage({ params }: { params: { path?: string[] } }) {
    const path = params.path ?? [];

    const decodePath = (segments: string[]) => segments.map(decodeURIComponent);
    const encodePath = (segments: string[]) => segments.map(encodeURIComponent).join("/");

    let currentLevel: NotesData | string[] | null = notesData.Notes;
    for (const segment of decodePath(path)) {
        if (currentLevel && typeof currentLevel === "object" && !Array.isArray(currentLevel)) {
            currentLevel = currentLevel[segment] ?? null;
        } else {
            notFound();
        }
    }

    return (
        <div className="text-white text-center p-10">
            <h1 className="text-3xl mb-6 text-black py-8">{decodePath(path).join(" > ") || "Tasting Notes"}</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.isArray(currentLevel) ? (
                    currentLevel.map((note) => <p key={note} className="bg-sky-600 p-4 rounded">{note}</p>)
                ) : (
                    currentLevel &&
                    Object.keys(currentLevel).map((sub) => (
                        <Link
                            key={sub}
                            href={`/notes/${encodePath([...path, sub])}`}
                            className="bg-gray-900 p-4 rounded hover:bg-sky-600 transition"
                        >
                            {sub}
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export function generateStaticParams() {
    function getPaths(obj: NotesData, prefix: string[] = []): { path: string[] }[] {
        return Object.entries(obj).flatMap(([key, value]) => {
            const newPath = [...prefix, key];
            return typeof value === "object" && value !== null && !Array.isArray(value)
                ? [{ path: newPath }, ...getPaths(value, newPath)]
                : [{ path: newPath }];
        });
    }

    return getPaths(notesData.Notes);
}
