import { useState, useEffect } from "react";

import Categories from "./categories";
import Subcategories from "./subcategories";
import NoteTable from "@/sections/notetable";
import notesData from "@/data/tasting-notes-wheel.json";
import type { PlanetData } from "@/sections/galaxy/types/planetdata";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface System {
    name: string;
    link: string;
}

interface PlanetMenuProps {
    planetData: PlanetData[];
    path: string | undefined;
    selectedCategory: string | null;
    handleSelection: (planet: PlanetData) => void;
    systems: System[];
}

export default function PlanetMenu({
    planetData,
    path,
    selectedCategory,
    handleSelection,
    systems
}: PlanetMenuProps) {
    type NotePaths = keyof typeof notesData.Notes;
    const currentLevel: string[] | null =
        path && selectedCategory && path in notesData.Notes && selectedCategory in notesData.Notes[path as NotePaths]
            ? (notesData.Notes[path as NotePaths][selectedCategory as keyof typeof notesData.Notes[NotePaths]] as string[])
            : null;

    const [selectedSubCategory, setSelectedSubCategory] = useState<string[]>(() => {
        // Load selectedSubCategory array from localStorage on initial render
        const stored = localStorage.getItem("selectedSubCategory");
        return stored ? JSON.parse(stored) : [];
    });

    const toggleButton = (note: string) => {
        setSelectedSubCategory((prev) =>
            prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
        );
    };

    useEffect(() => {
        localStorage.setItem("selectedSubCategory", JSON.stringify(selectedSubCategory));
    }, [selectedSubCategory]);    

    // Navigation handler
    let currentIndex = -1;
    if (path) {
        // Find the index of the current system based on the path matching the link
        currentIndex = systems.findIndex(system => system.link === `/flavors/${path}`);
    }

    let prevSystem: System | null = null;
    let nextSystem: System | null = null;

    if (currentIndex !== -1 && systems.length > 0) {
        const prevIndex = (currentIndex - 1 + systems.length) % systems.length;
        const nextIndex = (currentIndex + 1) % systems.length;
        prevSystem = systems[prevIndex];
        nextSystem = systems[nextIndex];
    }

    return (
        <div className="flex flex-col h-full items-center justify-start bg-white p-4 overflow-scroll">
                {/* --- Navigation --- */}
                <div className="w-full flex items-center justify-center space-x-4 mb-6">
                    {prevSystem ? (
                        <Link href={prevSystem.link} passHref>
                            <Button variant="reverse" size="sm">
                                &lt; {prevSystem.name}
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="reverse" size="sm" disabled>&lt; Prev</Button>
                    )}

                    <p className="bg-black text-white font-bold border-black border-2 p-4 text-center">
                        {path ? `${path} System` : "Select System"}
                    </p>

                    {nextSystem ? (
                        <Link href={nextSystem.link} passHref>
                            <Button variant="reverse" size="sm">
                                {nextSystem.name} &gt;
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="reverse" size="sm" disabled>Next &gt;</Button>
                    )}
                </div>

                {/* Categories */}
                <div className="w-full">
                    <Categories
                        planetData={planetData}
                        selected={selectedCategory}
                        handleSelection={handleSelection}
                    />
                </div>

                {/* Subcategories */}
                {currentLevel && Array.isArray(currentLevel) && (
                    <div className="w-full mb-4">
                        <Subcategories
                            notes={currentLevel}
                            selected={selectedSubCategory}
                            toggle={toggleButton}
                        />
                    </div>
                )}

                {/* Note table */}
                <div className="w-full overflow-scroll mb-6 min-h-52">
                    <NoteTable subcategories={selectedSubCategory} />
                </div>

                {/* Bottom button */}
                <div className="w-full flex justify-center mb-6">
                    <Button>
                        Show Matching Products
                    </Button>
                </div>
            </div>

    );
}
