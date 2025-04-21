import { Orbit } from "lucide-react"

export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-full grid-bg-dark overflow-hidden">
      <Orbit
        strokeWidth={1.0}
        style={{ stroke: "#475773" }}
        className="w-24 h-24 animate-spin-slow"
      />
    </div>
  );
}
