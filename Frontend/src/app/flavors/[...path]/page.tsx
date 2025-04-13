"use client";

import { useState, useEffect } from "react";
import { Mesh } from "three";

import Galaxy from "@/sections/galaxy/scene/galaxy";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import PlanetMenu from "@/sections/galaxy/menu/galaxymenu";
import { usePlanetData } from "@/sections/galaxy/hooks/usePlanetData";
import type { PlanetData } from "@/sections/galaxy/types/planetdata";
import { useIsMobile } from "@/hooks/useIsMobile";

// Define systems
const systems = [
    { name: 'Fruity System', link: '/flavors/Fruity' },
    { name: 'Herbal System', link: '/flavors/Herbal' },
    { name: 'Sweet System', link: '/flavors/Sweet' },
    { name: 'Savory System', link: '/flavors/Savory' },
    { name: 'Warm System', link: '/flavors/Warm' },
];

export default function NotesPage({ params }: { params: { path?: string[] } }) {
    const path = params.path ?? [];
    const currentSystemPath = path[0];
    const [targetRef, setTargetRef] = useState<Mesh | null>(null);
    const [reset, setReset] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const planetDataRef = usePlanetData(path);
    const isMobile = useIsMobile();

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
        <div
            style={{
                position: "absolute",
                top: "-16px",
                width: "100vw",
                height: "calc(100vh - 42px)",
                overflow: "clip",
            }}
        >
            <ResizablePanelGroup
                direction={isMobile ? "vertical" : "horizontal"}
                className="my-4 w-full border-4 border-border text-mtext shadow-shadow"
            >
                {/* galaxy scene goes on top for mobile */}
                <ResizablePanel defaultSize={isMobile ? 60 : 100 - leftPanelInitialSize}>
                    <Galaxy
                        planetData={planetDataRef.current}
                        targetRef={targetRef}
                        handleSelection={handleSelection}
                        reset={reset}
                        onResetComplete={handleResetComplete}
                        path={currentSystemPath}
                    />
                </ResizablePanel>

                <ResizableHandle />

                {/* menu goes below on mobile */}
                <ResizablePanel
                    defaultSize={isMobile ? 40 : leftPanelInitialSize}
                    minSize={isMobile ? 20 : 40}
                    className={isMobile ? "min-h-[20%]" : "min-w-4/10"}
                >
                    <PlanetMenu
                        planetData={planetDataRef.current}
                        path={currentSystemPath}
                        selectedCategory={selectedCategory}
                        handleSelection={handleSelection}
                        systems={systems}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
