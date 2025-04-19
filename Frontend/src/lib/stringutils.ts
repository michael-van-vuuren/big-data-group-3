export function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

const compressedFormLookup: Record<string, string> = {
    "blueberry": "blue berry",
    "lemongrass": "lemon grass",
    "grapefruit": "grape fruit",
    "passionfruit": "passion fruit",
    "watermelon": "water melon",
    "stonefruit": "stone fruit",
    "cranberry": "cran berry",
    "raspberry": "rasp berry",
    "strawberry": "straw berry",
    "blackberry": "black berry",
    "gooseberry": "goose berry",
    "mulberry": "mul berry",
    "elderflower": "elder flower",
    "soysauce": "soy sauce",
    "buttermilk": "butter milk",
    "marshmallow": "marsh mallow",
    "cheesecake": "cheese cake",
    "popcorn": "pop corn",
    "peanut": "pea nut",
    "hazelnut": "hazel nut",
    "walnut": "wal nut",
    "chestnut": "chest nut",
    "butterscotch": "butter scotch",
};

export function toCompressedForm(str: string): string {
    for (const compressedKey in compressedFormLookup) {
        if (compressedFormLookup.hasOwnProperty(compressedKey) && compressedFormLookup[compressedKey] === str.toLowerCase()) {
            return compressedKey;
        }
    }

    return str
}

export function fromCompressedForm(str: string): string {
    const key = str.toLowerCase();
    return compressedFormLookup[key] || str;
}

