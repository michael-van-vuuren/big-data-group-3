
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

  if (price === undefined || maxPrice <= minPrice) {
    return defaultStyle;
  }

  const normalizedPrice = Math.max(0, Math.min(1, (price - minPrice) / (maxPrice - minPrice)));

  const hue = 120 * (1 - normalizedPrice);
  const saturation = 85;
  const lightness = 50;

  const textColor = (hue > 45 && hue < 150 && lightness > 40) ? 'black' : 'white';

  return {
    backgroundColor: `hsl(${hue.toFixed(0)}, ${saturation}%, ${lightness}%)`,
    color: textColor,
  };
};
