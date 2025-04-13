import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 1000): boolean {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < breakpoint;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [breakpoint]);

    return isMobile;
}
