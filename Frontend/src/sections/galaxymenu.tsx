import { Mesh } from "three";
import { Button } from "@/components/ui/button";

interface PlanetData {
    name: string;
    meshRef: Mesh | null;
}

interface PlanetMenuProps {
    planetName: string | null;
    setPlanetName: (name: string | null) => void;
    targetRef: Mesh | null;
    setTargetRef: (mesh: Mesh | null) => void;
    setReset: (reset: boolean) => void;
    planets: PlanetData[];
    handlePlanetClick: (planet: Mesh, name: string) => void;
}

const PlanetMenu: React.FC<PlanetMenuProps> = ({
    planetName,
    planets,
    handlePlanetClick,
}) => {
    return (
        <div className="flex flex-col h-full items-center justify-center bg-main p-4">
            <div className="px-14 py-2 bg-black text-white rounded-base text-center">
                {planetName ? planetName : "No planet selected"}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                {planets.map((planet) => (
                    <Button
                        key={planet.name}
                        variant="whiteText"
                        color="#203568"
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
        </div>
    );
};

export default PlanetMenu;
