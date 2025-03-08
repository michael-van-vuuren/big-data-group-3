"use client";  // ✅ Ensure it's a Client Component

import React, { useEffect, useRef, useState } from "react";

const CoffeeGlobe = () => {
    const globeRef = useRef(null);
    const [locations, setLocations] = useState([]);
    const [Globe, setGlobe] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {  
            import("globe.gl").then((GlobeModule) => {
                setGlobe(() => GlobeModule.default);
            });
        }
    }, []);

    useEffect(() => {
        if (!Globe || !globeRef.current) return;

        const world = Globe()(globeRef.current)
            .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
            .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
            .pointColor(() => "red")  // ✅ Set a visible point color
            .pointAltitude(0.15)  // ✅ Increase altitude so points don’t stick to surface
            .pointRadius(1.2)  // ✅ Increase point size for visibility
            .labelText(d => `${d.name} (${d.variety})`)  // ✅ Show Name & Variety in tooltip
            .labelSize(2.5)
            .labelDotRadius(1.5)
            .labelColor(() => "white");

        // ✅ Fetch JSON with coffee data
        fetch("/data/merged_coffee_data.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("✅ Loaded coffee data:", data);  // ✅ Debugging Log
                if (Array.isArray(data) && data.length > 0) {
                    setLocations(data);
                    world.pointsData(data);
                } else {
                    console.warn("⚠️ No valid data found in JSON.");
                }
            })
            .catch(error => console.error("❌ Error loading JSON:", error));

    }, [Globe]);  // ✅ Runs only after Globe is loaded

    return (
        <div>
            <h2 style={{ color: "white", textAlign: "center", marginBottom: "10px" }}>
            Coffee Producers Map
            </h2>
            <div ref={globeRef} style={{ width: "100vw", height: "90vh" }} />
        </div>
    );
};

export default CoffeeGlobe;
