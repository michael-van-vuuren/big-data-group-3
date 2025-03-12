interface PlanetHeaderProps {
    planetName: string | null;
}

export default function PlanetHeader({ planetName }: PlanetHeaderProps) {
    return (
        <div className="px-14 py-2 bg-black text-white rounded-base text-center">
            {planetName ? planetName : "No planet selected"}
        </div>
    );
}
