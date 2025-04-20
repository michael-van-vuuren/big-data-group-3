"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/button";
import { Separator } from "@/components/separator";

const Dashboard = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <p className="text-white mt-10">Loading...</p>;
    }

    return (
        <div
            style={{
                width: "100vw",
                minHeight: "calc(100vh - 58px)",
                overflowY: "auto",
            }}
            className="w-full flex flex-col border-4 border-black text-mtext p-4 pt-8 sm:p-16 bg-blue-900 grid-bg-dot justify-start items-center"
        >
            <div className="bg-white border-2 border-black shadow-lightLg p-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground cosmic-bg bg-clip-text text-transparent mb-8">
                    Welcome, {user?.name ?? "Business"}!
                </h1>

                <Separator />

                <div className="mt-8 flex gap-8 flex-col sm:flex-row justify-center py-4">
                    <Button
                        variant="noShadow"
                        className="text-black border-black bg-white border-2 font-bold hover:cosmic-bg hover:text-white transition-all duration-200 h-12"
                    >
                        <Link href="/business/add-products">
                            Add Products
                        </Link>
                    </Button>

                    <Button
                        variant="noShadow"
                        className="text-black border-black bg-white border-2 font-bold hover:cosmic-bg hover:text-white transition-all duration-200 h-12"
                    >
                        <Link href="/business/products">
                            View Products
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
