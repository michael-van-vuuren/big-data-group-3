"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { favoritesApi } from "@/lib/api";
import type { Product } from "@/app/flavors/[...path]/types/types";
import Logo from "@/components/logo";
import { toTitleCase } from "@/lib/utils/stringutils";

const UserProfilePage = () => {
    const { user, isLoading } = useAuth();
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [targetCount, setTargetCount] = useState<number | null>(null);

    // Fetch favorites
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favorites: Product[] = await favoritesApi.getFavoriteProducts();
                setTargetCount(favorites.length);
            } catch (e) {
                console.error("Failed to fetch favorite count", e);
                setTargetCount(0);
            }
        };

        fetchFavorites();
    }, []);

    // Favorite counter animation
    useEffect(() => {
        if (targetCount === null || favoriteCount >= targetCount) return;

        let current = favoriteCount;
        let speed = 100;
        const minSpeed = 1;

        const tick = () => {
            if (current < (targetCount ?? 0)) {
                current += 1;
                setFavoriteCount(current);

                speed = Math.max(minSpeed, speed * 0.95);
                setTimeout(tick, speed);
            }
        };

        tick();

    }, [targetCount]);

    if (isLoading) {
        return <div className="p-4">Loading profile…</div>;
    }

    if (!user) {
        return <div className="p-4 text-red-500">User not found. Please login.</div>;
    }

    return (
        <div
            style={{
                position: "absolute",
                top: "-16px",
                width: "100vw",
                height: "calc(100vh - 58px)",
                overflow: "hidden",
            }}
            className="my-4 w-full flex flex-col border-4 border-black text-mtext p-6 cosmic-bg justify-start items-center"
        >
            <div className="bg-white border-black border-2 px-12 py-8 mt-16 shadow-light">
                <div className="flex flex-row items-center gap-8 mb-8">
                    <Logo />
                </div>

                <div className="flex flex-row gap-8 text-lg">
                    {/* Left column: name, email, role */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <p className="font-semibold">Name:</p>
                            <p>{user.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Email:</p>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Account Type:</p>
                            <p>{toTitleCase(user.role)}</p>
                        </div>
                    </div>

                    {/* Right column: favorites */}
                    <div className="flex-1 flex items-start lg:justify-end">
                        {targetCount !== null && (
                            <div>
                                <p className="font-semibold mb-1">Favorites:</p>
                                <span className="bg-blue-600 text-white font-lg bg-blue border-black border-2 px-3 py-1 inline-block w-full text-center font-bold">
                                    {favoriteCount}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserProfilePage;
