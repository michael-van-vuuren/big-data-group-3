import { useState } from "react";
import { Mesh } from "three";

import PlanetHeader from "./header";
import Categories from "./categories";
import Subcategories from "./subcategories";
import BeanLibrary from "@/sections/beanlibrary";
import notesData from "@/data/tasting-notes-wheel.json";
import type { PlanetData } from "@/sections/galaxy/types/planetdata";

interface PlanetMenuProps {
    planetData: PlanetData[];
    getNoteColor: (note: string | null) => string;
    path: string;
    selectedCategory: string | null;
    handleSelection: (planet: PlanetData) => void;
}

export default function PlanetMenu({ planetData, getNoteColor, path, selectedCategory, handleSelection }: PlanetMenuProps) {
    type NotePaths = keyof typeof notesData.Notes;
    const currentLevel: string[] | null =
        selectedCategory && path in notesData.Notes && selectedCategory in notesData.Notes[path as NotePaths]
            ? (notesData.Notes[path as NotePaths][selectedCategory as keyof typeof notesData.Notes[NotePaths]] as string[])
            : null;

    const [selectedSubCategory, setSelectedSubCategory] = useState<string[]>([]);

    const toggleButton = (note: string) => {
        setSelectedSubCategory((prev) =>
            prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
        );
    };

    return (
        <div className="flex flex-col h-full items-center justify-center bg-main p-4">
            <PlanetHeader planetName={selectedCategory} />

            <div className="flex flex-col overflow-scroll justify-start">
                <Categories
                    planetData={planetData}
                    selected={selectedCategory}
                    getNoteColor={getNoteColor}
                    handleSelection={handleSelection}
                />

                {currentLevel && Array.isArray(currentLevel) && (
                    <Subcategories
                        notes={currentLevel}
                        selected={selectedSubCategory}
                        getNoteColor={getNoteColor}
                        toggle={toggleButton}
                    />
                )}

                <div className="overflow-scroll p-1 m-4 min-h-96 bg-black">
                    <BeanLibrary />
                </div>
            </div>
        </div>
    );
}
