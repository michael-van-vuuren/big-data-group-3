"use client";

import { useState } from "react";
import { Mesh } from "three";

import Galaxy from "@/sections/galaxy/scene/galaxy";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import PlanetMenu from "@/sections/galaxy/menu/galaxymenu";
import { getNoteColor } from "@/lib/colorutils";
import { usePlanetData } from "@/sections/galaxy/hooks/usePlanetData";
import type { PlanetData } from "@/sections/galaxy/types/planetdata"

export default function NotesPage({ params }: { params: { path?: string[] } }) {
    const path = params.path ?? [];
    const [targetRef, setTargetRef] = useState<Mesh | null>(null);
    const [reset, setReset] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const planetDataRef = usePlanetData(path);

    const handleSelection = (planet: PlanetData) => {
        setSelectedCategory((prev) => prev === planet.name ? null : planet.name);
        if (targetRef === planet.meshRef) {
            setReset(true);
            setSelectedCategory(null);
        } else {
            if (planet.meshRef instanceof Mesh) {
                setTargetRef(planet.meshRef);
            } else {
                setTargetRef(null);
            }
            setReset(false);
            setSelectedCategory(planet.name);
        }
    };

    const handleResetComplete = () => {
        setTargetRef(null);
        setReset(false);
        setSelectedCategory(null);
    };

    const leftPanelInitialSize = 40;

    return (
        <div style={{ height: "80vh", width: "100vw" }}>
            <ResizablePanelGroup
                direction="horizontal"
                className="my-4 w-full border-4 border-border text-mtext shadow-shadow"
            >
                {/* side menu */}
                <ResizablePanel defaultSize={leftPanelInitialSize} className="min-w-4/10">
                    <PlanetMenu
                        planetData={planetDataRef.current}
                        getNoteColor={getNoteColor}
                        path={path[0]}
                        selectedCategory={selectedCategory}
                        handleSelection={handleSelection}
                    />
                </ResizablePanel>

                <ResizableHandle />

                {/* galaxy scene */}
                <ResizablePanel defaultSize={100 - leftPanelInitialSize}>
                    <Galaxy
                        planetData={planetDataRef.current}
                        targetRef={targetRef}
                        handleSelection={handleSelection}
                        reset={reset}
                        onResetComplete={handleResetComplete}
                        path={path[0]}
                    />

                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
