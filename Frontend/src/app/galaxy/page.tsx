"use client";

import Galaxy from "@/sections/galaxy/galaxy";
import { useState } from "react";

export default function Home() {
    const [planetName, setPlanetName] = useState<string | null>(null);

    return (
        <div style={{ height: "80vh", width: "100vw" }}>
            <Galaxy setPlanetName={setPlanetName} />
            {planetName && (
                <div
                    style={{
                        position: "absolute",
                        top: "55%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        padding: "8px 16px",
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    {planetName}
                </div>
            )}
        </div>
    );
}
