import { Button } from "@/components/ui/button";
import { Mesh } from "three";

import type { PlanetData } from "@/sections/galaxy/types/planetdata";

interface CategoriesProps {
    planetData: PlanetData[];
    selected: string | null;
    getNoteColor: (note: string | null) => string;
    handleSelection: (planet: PlanetData) => void;
}

export default function Categories({ planetData, selected, getNoteColor, handleSelection }: CategoriesProps) {
    return (
        <div className="grid grid-cols-4 gap-3 m-4">
            {planetData.map((planet) => {
                const isActive = selected === planet.name;
                return (
                    <Button
                        key={planet.name}
                        variant="whiteText"
                        color={getNoteColor(planet.name)}
                        active={isActive}
                        onClick={() => {
                          handleSelection(planet);  
                        }}
                    >
                        {planet.name}
                    </Button>
                );
            })}
        </div>
    );
}
