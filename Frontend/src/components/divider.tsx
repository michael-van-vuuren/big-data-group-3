export default function Divider({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative flex items-center justify-center h-20 border-y-2 border-border dark:border-darkBorder dark:bg-secondaryBlack bg-white py-3 font-base sm:py-5">
      <span className="absolute bg-white dark:bg-secondaryBlack px-4">{children}</span>
    </div>
  );
}
