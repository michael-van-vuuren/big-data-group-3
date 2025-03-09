import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarsProps {
    count?: number;
    minRadius?: number;
    maxRadius?: number;
}

export default function Stars({ count = 1000, minRadius = 20, maxRadius = 200 }: StarsProps) {
    const ref = useRef<THREE.Points>(null!);

    const { positions, colors, shimmerSpeeds, shimmerOffsets, flickerIntensities } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3); 
        const shimmerSpeeds = new Float32Array(count);
        const shimmerOffsets = new Float32Array(count);
        const flickerIntensities = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            let r, x, y, z;
            do {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                r = minRadius + Math.random() * (maxRadius - minRadius);

                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
            } while (r < minRadius);

            positions.set([x, y, z], i * 3);

            const baseColor = Math.random() * 0.5 + 0.5;
            const colorVariation = Math.random() * 0.15;
            colors.set([baseColor + colorVariation, baseColor, baseColor - colorVariation], i * 3);

            shimmerSpeeds[i] = 1.2 + Math.random() * 1.5;
            shimmerOffsets[i] = Math.random() * Math.PI * 2;
            flickerIntensities[i] = 0.3 + Math.random() * 0.7;
        }

        return { positions, colors, shimmerSpeeds, shimmerOffsets, flickerIntensities };
    }, [count, minRadius, maxRadius]);

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    useFrame(({ clock }) => {
        if (ref.current) {
            const time = clock.getElapsedTime();
            const colorAttribute = ref.current.geometry.attributes.color as THREE.BufferAttribute;

            for (let i = 0; i < count; i++) {
                const shimmer = 0.5 + 0.5 * Math.sin(time * shimmerSpeeds[i] + shimmerOffsets[i]);
                const flicker = flickerIntensities[i] * (0.6 + 0.4 * Math.sin(time * 2 + shimmerOffsets[i]));
                
                const finalIntensity = shimmer * flicker;
                colorAttribute.setXYZ(i, finalIntensity, finalIntensity, finalIntensity);
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
