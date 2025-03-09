"use client";

import Galaxy from "@/sections/galaxy/galaxy";
import { useState } from "react";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
    const [planetName, setPlanetName] = useState<string | null>(null);

    return (
        <>
            <div style={{ height: "80vh", width: "100vw" }}>
                <ResizablePanelGroup
                    direction="horizontal"
                    className="rounded-base w-full border-2 border-border text-mtext shadow-shadow"
                >
                    {/* menu */}
                    <ResizablePanel defaultSize={20}>
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
                    <ResizablePanel defaultSize={80}>
                        <div className="flex h-full items-center justify-center bg-main p-0">
                            <Galaxy setPlanetName={setPlanetName} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </>
    );
}
