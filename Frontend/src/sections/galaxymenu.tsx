import { useState } from "react";
import { Mesh } from "three";
import { Button } from "@/components/ui/button";
import BeanLibrary from "./beanlibrary";

import notesData from "@/data/tasting-notes-wheel.json";

interface PlanetData {
    name: string;
    meshRef: Mesh | null;
}

interface PlanetMenuProps {
    planetName: string | null;
    planets: PlanetData[];
    handlePlanetClick: (planet: Mesh, name: string) => void;
    getNoteColor: (note: string | null) => string;
    path: string;
}

export default function PlanetMenu({
    planetName,
    planets,
    handlePlanetClick,
    getNoteColor,
    path
}: PlanetMenuProps) {
    type NotePaths = keyof typeof notesData.Notes;
    const currentLevel: string[] | null =
        planetName && path in notesData.Notes && planetName in notesData.Notes[path as NotePaths]
            ? (notesData.Notes[path as NotePaths][planetName as keyof typeof notesData.Notes[NotePaths]] as string[])
            : null;

    const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

    const toggleNote = (note: string) => {
        setSelectedNotes((prev) =>
            prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
        );
    };

    return (
        <div className="flex flex-col h-full items-center justify-center bg-main p-4">
            <div className="px-14 py-2 bg-black text-white rounded-base text-center">
                {planetName ? planetName : "No planet selected"}
            </div>

            <div className="flex flex-col overflow-scroll justify-start">
                <div className="grid grid-cols-4 gap-3 m-4">
                    {planets.map((planet) => (
                        <Button
                            key={planet.name}
                            variant="whiteText"
                            color={getNoteColor(planet.name)}
                            onClick={() => {
                                if (planet.meshRef) {
                                    handlePlanetClick(planet.meshRef, planet.name);
                                }
                            }}
                        >
                            {planet.name}
                        </Button>
                    ))}
                </div>
                
                {currentLevel && Array.isArray(currentLevel) && (
                    <div className="grid grid-cols-3 gap-3 m-6">
                        {currentLevel.map((note) => (
                            <div key={note} className="flex items-center gap-2">
                                <Button 
                                    variant="round" 
                                    size="icon" 
                                    color={getNoteColor(note)} 
                                    onClick={() => toggleNote(note)}
                                    className="relative"
                                >
                                    {selectedNotes.includes(note) && (
                                        <span className="absolute w-3 h-3 bg-black rounded-full"></span>
                                    )}
                                </Button>
                                <p className="text-sm">{note}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="overflow-scroll p-1 m-4 min-h-96 bg-black">
                    <BeanLibrary />
                </div>
            </div>
        </div>
    );
}
