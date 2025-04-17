
// Coloring helper for price stickers
export const getPriceColorStyle = (
  price: number | undefined,
  minPrice: number,
  maxPrice: number
): React.CSSProperties => {
  const defaultStyle: React.CSSProperties = {
    backgroundColor: 'hsl(222, 47%, 50%)', // default is blue
    color: 'white',
  };

  if (
    price === undefined ||
    minPrice <= 0 ||
    price <= 0 ||
    maxPrice <= minPrice
  ) {
    return defaultStyle;
  }

  // Log scale 
  const logMin = Math.log(minPrice);
  const logMax = Math.log(maxPrice);
  const logPrice = Math.log(price);

  const normalizedPrice = Math.max(
    0,
    Math.min(1, (logPrice - logMin) / (logMax - logMin))
  );

  const hue = 120 * (1 - normalizedPrice); // green (120) to red (0)
  const saturation = 85;
  const lightness = 50;

  const textColor = hue > 45 && hue < 150 && lightness > 40 ? 'black' : 'white';

  return {
    backgroundColor: `hsl(${hue.toFixed(0)}, ${saturation}%, ${lightness}%)`,
    color: textColor,
  };
};

