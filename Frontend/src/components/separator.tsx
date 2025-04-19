export const Separator = ({ color = "slate" }) => {
  const lineStyle = color === "black" ? "border-slate-700 border-t-2 border-dashed" : "border-slate-400 border-t-2 border-dotted";

  return (
    <>
      <div className="h-0.5"></div>
      <div className={`pb-2 ${lineStyle} h-1`} />
    </>
  );
};
