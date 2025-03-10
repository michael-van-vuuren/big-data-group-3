"use client";

import Galaxy from "@/sections/galaxy/galaxy2";
import { useState } from "react";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import notesData from "@/data/tasting-notes-wheel.json";

export default function NotesPage({ params }: { params: { path?: string[] } }) {
    const path = params.path ?? [];
    const [planetName, setPlanetName] = useState<string | null>(null);
    let currentLevel = notesData.Notes as Record<string, unknown>;

    for (const segment of path) {
        if (currentLevel && typeof currentLevel === "object" && !Array.isArray(currentLevel)) {
            currentLevel = currentLevel[segment] as Record<string, unknown> ?? null;
        } else {
            return <p>Not Found</p>;
        }
    }

    const planetData = currentLevel && typeof currentLevel === "object"
        ? Object.keys(currentLevel)
        : [];

    return (
        <>
            <div style={{ height: "80vh", width: "100vw" }}>
                <ResizablePanelGroup
                    direction="horizontal"
                    className="rounded-base w-full border-2 border-border text-mtext shadow-shadow"
                >
                    {/* menu */}
                    <ResizablePanel defaultSize={30}>
                        <div className="flex h-full items-center justify-center bg-main p-0">
                            {planetName ? (
                                <div
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "black",
                                        color: "white",
                                        borderRadius: "4px",
                                        textAlign: "center",
                                    }}
                                >
                                    {planetName}
                                </div>
                            ) : (
                                <span className="font-base">No planet selected</span>
                            )}
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* galaxy scene */}
                    <ResizablePanel defaultSize={70}>
                        <div className="flex h-full items-center justify-center bg-main p-0">
                            <Galaxy setPlanetName={setPlanetName} planetsData={planetData} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </>
    );
}
