import fs from "fs";

const generateStars = (count = 1600, minRadius = 400, maxRadius = 600) => {
    const stars = [];

    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = minRadius + Math.random() * (maxRadius - minRadius);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        const baseColor = Math.random() * 0.5 + 0.5;
        const colorVariation = Math.random() * 0.15;

        stars.push({
            position: [x, y, z],
            color: [baseColor + colorVariation, baseColor, baseColor - colorVariation],
            shimmerSpeed: 1.2 + Math.random() * 1.5,
            shimmerOffset: Math.random() * Math.PI * 2,
            flickerIntensity: 0.3 + Math.random() * 0.7,
        });
    }

    return stars;
};

fs.writeFileSync("../../data/stars.json", JSON.stringify(generateStars(), null, 2));
console.log("Static stars saved to stars.json");
