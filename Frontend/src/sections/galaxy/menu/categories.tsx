import { Button } from "@/components/ui/button";

import type { PlanetData } from "@/sections/galaxy/types/planetdata";
import { getNoteColor } from "@/lib/colorutils";

interface CategoriesProps {
    planetData: PlanetData[];
    selected: string | null;
    handleSelection: (planet: PlanetData) => void;
}

export default function Categories({ planetData, selected, handleSelection }: CategoriesProps) {
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
