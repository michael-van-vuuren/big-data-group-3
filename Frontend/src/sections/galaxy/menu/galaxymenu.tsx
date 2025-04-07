import { useState } from "react";

import PlanetHeader from "./header";
import Categories from "./categories";
import Subcategories from "./subcategories";
import BeanLibrary from "@/sections/beanlibrary";
import notesData from "@/data/tasting-notes-wheel.json";
import type { PlanetData } from "@/sections/galaxy/types/planetdata";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Header from "@/sections/header";

interface PlanetMenuProps {
    planetData: PlanetData[];
    path: string;
    selectedCategory: string | null;
    handleSelection: (planet: PlanetData) => void;
}


export default function PlanetMenu({ planetData, path, selectedCategory, handleSelection }: PlanetMenuProps) {
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
        <div className="flex flex-col h-full items-center justify-center bg-white p-8">
            <PlanetHeader planetName={selectedCategory} />

            <div className="flex flex-col overflow-scroll justify-start">
                <Categories
                    planetData={planetData}
                    selected={selectedCategory}
                    handleSelection={handleSelection}
                />

                {currentLevel && Array.isArray(currentLevel) && (
                    <Subcategories
                        notes={currentLevel}
                        selected={selectedSubCategory}
                        toggle={toggleButton}
                    />
                )}

                <div className="overflow-scroll p-1 m-4 bg-black">
                    <BeanLibrary
                        subcategories={selectedSubCategory}
                    />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <Button>
                        Save Notes to Cart
                    </Button>
                    <Button>
                        Go To Shopping Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}
