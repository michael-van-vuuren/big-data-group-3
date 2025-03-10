import * as THREE from "three";

export function getRandomColor(baseColor: string): string {
    const base = new THREE.Color(baseColor);

    const hsl = { h: 0, s: 0, l: 0 };
    base.getHSL(hsl);

    const offsetAngle = (Math.random() < 0.5 ? -45 : 45) / 360;
    const analogousHue = (hsl.h + offsetAngle) % 1;

    const randomSaturation = Math.random() * 0.2 + 0.8;
    const randomLightness = Math.random() * 0.1 + 0.5;

    const analogousColor = new THREE.Color().setHSL(analogousHue, randomSaturation, randomLightness);

    const finalColor = base.clone().lerp(analogousColor, 0.5);

    return finalColor.getStyle();
}

export function createGradientTexture(baseColor: string): THREE.Texture {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d")!;

    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
    const colorStops = Math.random() * 10 + 5;
    gradient.addColorStop(0, baseColor);

    for (let i = 1; i <= colorStops; i++) {
        const randomColor = getRandomColor(baseColor);
        gradient.addColorStop(i / colorStops, randomColor);
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
