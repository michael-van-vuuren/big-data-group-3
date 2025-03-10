"use client";

import { useState, useRef } from "react";
import { Mesh, Object3D } from "three";

import Galaxy from "@/sections/galaxy/galaxy";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import PlanetMenu from "@/sections/galaxymenu";
import notesData from "@/data/tasting-notes-wheel.json";

const getRandomColor = () =>
    `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`;

export default function NotesPage({ params }: { params: { path?: string[] } }) {
    const path = params.path ?? [];
    const [planetName, setPlanetName] = useState<string | null>(null);
    const [targetRef, setTargetRef] = useState<Mesh | null>(null);
    const [reset, setReset] = useState(false);

    let currentLevel = notesData.Notes as Record<string, unknown>;

    for (const segment of path) {
        currentLevel = (currentLevel[segment] as Record<string, unknown>) ?? null;
    }

    const planetNames =
        currentLevel && typeof currentLevel === "object"
            ? Object.keys(currentLevel)
            : [];

    const planetDataRef = useRef(
        planetNames.map((name, index, arr) => {
            const middleIndex = (arr.length - 1) / 2;
            const variance = Math.pow(arr.length / 7, 2);
            const gaussianSize = Math.exp(
                -Math.pow(index - middleIndex, 2) / (2 * variance)
            );
            const randomVariation = (Math.random() - 0.5) * 1.5;

            return {
                radius: 25 + index * 16 + Math.random() * 5,
                color: getRandomColor(),
                size: Math.max(2, 1 + gaussianSize * 5 + randomVariation),
                speed: (0.05 + Math.random() * 0.2) / (index + 1),
                name,
                meshRef: null as Mesh | null,
                setMeshRef: (mesh: Mesh | null) => {
                    planetDataRef.current.find((p) => p.name === name)!.meshRef = mesh;
                },
            };
        })
    );

    const handlePlanetClick = (planet: Object3D, name: string) => {
        if (planet instanceof Mesh) {
            if (targetRef === planet) {
                setReset(true);
                setPlanetName(null);
            } else {
                setTargetRef(planet);
                setReset(false);
                setPlanetName(name);
            }
        }
    };

    const handleResetComplete = () => {
        setTargetRef(null);
        setReset(false);
        setPlanetName(null);
    };

    const leftPanelInitialSize = 33;

    return (
        <div style={{ height: "80vh", width: "100vw" }}>
            <ResizablePanelGroup
                direction="horizontal"
                className="my-4 w-full border-4 border-border text-mtext shadow-shadow"
            >
                {/* Menu - Now a separate component */}
                <ResizablePanel defaultSize={leftPanelInitialSize}>
                    <PlanetMenu
                        planetName={planetName}
                        setPlanetName={setPlanetName}
                        targetRef={targetRef}
                        setTargetRef={setTargetRef}
                        setReset={setReset}
                        planets={planetDataRef.current}
                        handlePlanetClick={handlePlanetClick}
                    />
                </ResizablePanel>

                <ResizableHandle />

                {/* Galaxy scene */}
                <ResizablePanel defaultSize={100 - leftPanelInitialSize}>
                    <Galaxy
                        planetsData={planetDataRef.current}
                        targetRef={targetRef}
                        handlePlanetClick={handlePlanetClick}
                        reset={reset}
                        onResetComplete={handleResetComplete}
                    />

                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
