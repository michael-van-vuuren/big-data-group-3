import { Mesh } from "three";

export interface PlanetData {
    name: string;
    radius: number;
    color: string;
    size: number;
    speed: number;
    meshRef: Mesh | null;
    setMeshRef: (mesh: Mesh | null) => void;
}
