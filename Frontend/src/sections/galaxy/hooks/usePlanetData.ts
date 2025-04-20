import { useRef } from "react";
import { Mesh } from "three";

import notesData from "@/data/tasting-notes-wheel.json";
import { getNoteColor } from "@/lib/utils/colorutils";
import { PlanetData } from "@/sections/galaxy/types/planetdata";

// generate planets based on path
export const usePlanetData = (path: string[]): React.MutableRefObject<PlanetData[]> => {
    let currentLevel = notesData.Notes as Record<string, unknown>;

    for (const segment of path) {
        currentLevel = (currentLevel[segment] as Record<string, unknown>) ?? {};
    }

    const planetNames = currentLevel && typeof currentLevel === "object" ? Object.keys(currentLevel) : [];

    const planetDataRef = useRef<PlanetData[]>(
        planetNames.map((name, index, arr) => {
            const middleIndex = (arr.length - 1) / 2;
            const variance = Math.pow(arr.length / 6, 2);
            const gaussianSize = Math.exp(-Math.pow(index - middleIndex, 2) / (2 * variance));
            const randomVariation = Math.random() * 2.5;

            return {
                name,
                meshRef: null,
                setMeshRef: (mesh: Mesh | null) => {
                    planetDataRef.current.find((p) => p.name === name)!.meshRef = mesh;
                },
                radius: 25 + index * 18 + Math.random() * 5,
                color: getNoteColor(name),
                size: Math.max(3, gaussianSize * 6 + randomVariation),
                speed: (0.05 + Math.random() * 0.2) / (index + 1),
            };
        })
    );
    return planetDataRef;
};
