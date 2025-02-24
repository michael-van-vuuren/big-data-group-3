"use client";

import { useState } from "react";
import BarChart from "@/components/barchart";
import ColorPicker from "@/components/colorpicker";
import { Slider } from '@/components/ui/slider'

export default function Visualization() {
  const [barColor, setBarColor] = useState<string>("#666");

  return (
    <div>
      <section className="min-h-[60dvh] p-10 grid-bg-dot">
        <h1 className="text-3xl font-bold text-center mb-6">D3.js Bar Chart</h1>
        <BarChart barColor={barColor} />
        <div className="flex justify-center items-center">
          <ColorPicker onChange={setBarColor} />
        </div>
        <div className="py-4 w-full flex justify-center items-center">
          <Slider trackColor="bg-teal-500" defaultValue={[33]} max={100} step={1} className="w-64" />
        </div>
      </section>
    </div>
  );
}
