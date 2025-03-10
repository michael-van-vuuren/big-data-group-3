import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import starData from "@/data/stars.json"; // Load the precomputed stars

export default function Stars({ background = "#000000" }) {
    const ref = useRef<THREE.Points>(null!);

    const { positions, colors, shimmerSpeeds, shimmerOffsets, flickerIntensities } = useMemo(() => {
        const count = starData.length;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const shimmerSpeeds = new Float32Array(count);
        const shimmerOffsets = new Float32Array(count);
        const flickerIntensities = new Float32Array(count);

        starData.forEach((star, i) => {
            positions.set(star.position, i * 3);
            colors.set(star.color, i * 3);
            shimmerSpeeds[i] = star.shimmerSpeed;
            shimmerOffsets[i] = star.shimmerOffset;
            flickerIntensities[i] = star.flickerIntensity;
        });

        return { positions, colors, shimmerSpeeds, shimmerOffsets, flickerIntensities };
    }, []);

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    useFrame(({ clock }) => {
        if (ref.current) {
            const time = clock.getElapsedTime();
            const colorAttribute = ref.current.geometry.attributes.color as THREE.BufferAttribute;

            const bgColor = new THREE.Color(background);
            const bgR = bgColor.r;
            const bgG = bgColor.g;
            const bgB = bgColor.b;

            for (let i = 0; i < starData.length; i++) {
                const shimmer = 0.5 + 0.5 * Math.sin(time * shimmerSpeeds[i] + shimmerOffsets[i]);
                const flicker = flickerIntensities[i] * (0.6 + 0.4 * Math.sin(time * 2 + shimmerOffsets[i]));
                
                const finalIntensity = shimmer * flicker;

                const r = bgR + (1 - bgR) * finalIntensity;
                const g = bgG + (1 - bgG) * finalIntensity;
                const b = bgB + (1 - bgB) * finalIntensity;

                colorAttribute.setXYZ(i, r, g, b);
            }

            colorAttribute.needsUpdate = true;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry attach="geometry" {...starGeometry} />
            <pointsMaterial attach="material" color="white" size={2.0} transparent vertexColors />
        </points>
    );
}
