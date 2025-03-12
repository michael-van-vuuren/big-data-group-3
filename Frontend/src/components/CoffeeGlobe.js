"use client";

import React, { useEffect, useRef, useState } from "react";

const CoffeeGlobe = () => {
    const globeRef = useRef(null);
    const [locations, setLocations] = useState([]);
    const [Globe, setGlobe] = useState(null);
    const [varieties, setVarieties] = useState([]);
    const [filteredVarieties, setFilteredVarieties] = useState([]);
    const [selectedVariety, setSelectedVariety] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

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
            .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
            .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
            .pointColor(d => selectedVariety && d.variety !== selectedVariety ? "rgba(150, 150, 150, 0.3)" : "rgba(255, 69, 0, 0.9)")
            .pointAltitude(0.1)
            .pointRadius(0.9)
            .labelText(d => `${d.name} (${d.variety})`)
            .labelSize(2.5)
            .labelDotRadius(1.5)
            .labelColor(() => "white");

        // ✅ Fetch JSON with coffee data
        fetch("/merged_coffee_data.json")
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log("✅ Loaded coffee data:", data);
                if (Array.isArray(data) && data.length > 0) {
                    setLocations(data);
                    const uniqueVarieties = [...new Set(data.map(d => d.variety))];
                    setVarieties(uniqueVarieties);
                    setFilteredVarieties(uniqueVarieties);  // Initialize filtered list
                    world.pointsData(data);
                } else {
                    console.warn("⚠️ No valid data found in JSON.");
                }
            })
            .catch(error => console.error("❌ Error loading JSON:", error));

    }, [Globe, selectedVariety]);

    // ✅ Search Functionality (Filters List)
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredVarieties(varieties.filter(variety => variety.toLowerCase().includes(query)));
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* ✅ Updated Sidebar with Search */}
            <div style={{ 
                width: "280px", 
                minWidth: "280px", 
                background: "#222", 
                color: "white", 
                padding: "15px",
                overflowY: "auto",
                borderRight: "2px solid rgba(255,255,255,0.2)"
            }}>
                <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Coffee Varieties</h3>

                {/* ✅ Search Bar */}
                <input
                    type="text"
                    placeholder="Search variety..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#333",
                        color: "white",
                        outline: "none"
                    }}
                />

                {/* ✅ Filtered List */}
                <ul style={{ listStyleType: "none", padding: 0, maxHeight: "75vh", overflowY: "auto" }}>
                    {filteredVarieties.map(variety => (
                        <li 
                            key={variety} 
                            style={{
                                padding: "12px",
                                margin: "6px 0",
                                cursor: "pointer",
                                background: selectedVariety === variety ? "#FF4500" : "#333",
                                textAlign: "center",
                                borderRadius: "6px",
                                transition: "0.3s",
                                fontSize: "14px"
                            }}
                            onClick={() => setSelectedVariety(selectedVariety === variety ? null : variety)}
                            onMouseEnter={(e) => e.target.style.background = "#FF5733"}
                            onMouseLeave={(e) => e.target.style.background = selectedVariety === variety ? "#FF4500" : "#333"}
                        >
                            {variety}
                        </li>
                    ))}
                </ul>
            </div>

            {/* ✅ Globe Component */}
            <div ref={globeRef} style={{ flex: 1 }} />
        </div>
    );
};

export default CoffeeGlobe;
