import { getNoteColor } from "@/lib/colorutils";

interface PlanetHeaderProps {
    planetName: string | null;
}

export default function PlanetHeader({ planetName }: PlanetHeaderProps) {
    const color = getNoteColor(planetName);

    return (
        <div className="px-14 py-2 text-white rounded-base text-center border-2 border-border" style={{ backgroundColor: color }}>
            {planetName ? planetName : "No planet selected"}
        </div>
    );
}
