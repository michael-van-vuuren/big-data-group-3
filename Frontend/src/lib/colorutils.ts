import { Color, Texture } from "three";

import notesColors from "@/data/notes-wheel-colors.json";

export const getNoteColor = (note: string | null) => {
    let colors = notesColors as Record<string, string>;
    if (note) {
        return colors[note];
    }
    return "#000";
};

const expandShorthandHex = (hex: string): string => {
    if (!hex) return "#FFF";

    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    return hex.replace(shorthandRegex, (m, r, g, b) => {
        return '#' + r + r + g + g + b + b;
    });
};

export const getNoteTextColor = (baseColor: string): 'black' | 'white' => {
    try {
        const fullHexColor = expandShorthandHex(baseColor);
        const color = new Color(fullHexColor);
        const { r, g, b } = color;

        // Calculate relative luminance (per WCAG)
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return luminance > 0.6 ? 'black' : 'white';
    } catch (error) {
        console.error(`Error processing color "${baseColor}":`, error);
        return 'black';
    }
};

export function getLighterDesaturatedColor(baseColor: string, lightnessIncrease: number = 0.1, desaturationAmount: number = 0.2, hueShiftAmount: number = -10): string {
    const color = new Color(baseColor);
    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);

    const hueShiftNormalized = hueShiftAmount / 360;

    hsl.h = (hsl.h + hueShiftNormalized) % 1;
    hsl.s = Math.max(0, hsl.s - desaturationAmount);
    hsl.l = Math.min(1, hsl.l + lightnessIncrease);

    const newColor = new Color().setHSL(hsl.h, hsl.s, hsl.l);
    return newColor.getStyle();
}

export function getRandomColor(baseColor: string, intensity: number = 0.3): string {
    const base = new Color(baseColor);
    const hsl = { h: 0, s: 0, l: 0 };
    base.getHSL(hsl);

    const offsetAngle = (Math.random() < 0.5 ? -10 : 10) / 360;
    const analogousHue = (hsl.h + offsetAngle) % 1;

    const randomSaturation = Math.max(0, Math.min(1, hsl.s * (0.85 + Math.random() * 10.0)));
    const randomLightness = Math.max(0, Math.min(1, hsl.l * (0.45 + Math.random() * 1.5)));

    const analogousColor = new Color().setHSL(analogousHue, randomSaturation, randomLightness);

    const finalColor = base.clone().lerp(analogousColor, intensity);

    return finalColor.getStyle();
}

export function createGradientTexture(baseColor: string): Texture {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d")!;

    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);

    const colorStops = Math.floor(Math.random() * 20) + 3;

    const base = new Color(baseColor);
    const baseHSL = { h: 0, s: 0, l: 0 };
    base.getHSL(baseHSL);

    const hueShiftAmount = 0.05;

    gradient.addColorStop(0, baseColor);

    for (let i = 1; i <= colorStops; i++) {
        const intensity = i % 2 === 0 ? 1.0 : 0.2;

        const hueShift = i % 2 === 0 ? hueShiftAmount * (i / colorStops) : 0.0;
        const newHue = (baseHSL.h + hueShift) % 1;
        const shiftedColor = new Color().setHSL(newHue, baseHSL.s, baseHSL.l);

        const color = colorStops > 12 && i % 6 === 0 ? "#000" : shiftedColor.getStyle();

        const randomColor = getRandomColor(color, intensity);

        const position = Math.pow(i / colorStops, 1.0);
        gradient.addColorStop(position, randomColor);
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
