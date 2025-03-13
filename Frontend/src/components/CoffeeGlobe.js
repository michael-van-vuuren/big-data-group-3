"use client";

import React, { useEffect, useRef, useState } from "react";
import globeData from "@/data/globe-data.json";

const CoffeeGlobe = () => {
    const globeRef = useRef(null);
    const [Globe, setGlobe] = useState(null);
    const [selectedVariety, setSelectedVariety] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const varieties = [...new Set(globeData.map(d => d.variety))];
    const filteredVarieties = varieties.filter(v => v.toLowerCase().includes(searchQuery.toLowerCase()));

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("globe.gl").then(({ default: GlobeModule }) => setGlobe(() => GlobeModule));
        }
    }, []);

    useEffect(() => {
        if (!Globe || !globeRef.current) return;

        Globe()(globeRef.current)
            .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
            .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
            .pointColor(d => selectedVariety && d.variety !== selectedVariety ? "rgba(150, 150, 150, 0.3)" : "rgba(255, 69, 0, 0.9)")
            .pointAltitude(0.1)
            .pointRadius(0.9)
            .labelText(d => `${d.name} (${d.variety})`)
            .labelSize(2.5)
            .labelDotRadius(1.5)
            .labelColor(() => "white")
            .pointsData(globeData);
    }, [Globe, selectedVariety]);

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <div className="w-80 min-w-[320px] bg-indigo-950 border-4 border-border text-white p-4 overflow-y-auto">
                <h3 className="text-center mb-4 text-lg font-semibold">Coffee Varieties</h3>
                <input
                    type="text"
                    placeholder="Search variety..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full p-2 mb-4 bg-white border-2 border-border text-black outline-none"
                />
                <ul className="list-none p-0 max-h-[75vh] overflow-y-auto">
                    {filteredVarieties.map(variety => (
                        <li 
                            key={variety} 
                            className={`p-3 my-1 text-center border-2 border-border rounded-base cursor-pointer transition duration-300 text-sm ${selectedVariety === variety ? "bg-orange-600" : "bg-indigo-900"}`}
                            onClick={() => setSelectedVariety(selectedVariety === variety ? null : variety)}
                            onMouseEnter={e => e.target.classList.add("bg-orange-500")}
                            onMouseLeave={e => e.target.classList.remove("bg-orange-500")}
                        >
                            {variety}
                        </li>
                    ))}
                </ul>
            </div>
            <div ref={globeRef} className="flex-1 flex items-center justify-center w-full h-screen overflow-hidden" />
        </div>
    );    
};

export default CoffeeGlobe;
