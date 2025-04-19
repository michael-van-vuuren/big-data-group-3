"use client";

import { useAuth } from "@/context/AuthContext";
import ProductForm from "./ProductForm";

const AddProducts = () => {
    const { user, isLoading } = useAuth();

    return (
        <div
            style={{
                width: "100vw",
                minHeight: "calc(100vh - 58px)",
                overflowY: "auto",
            }}
            className="w-full flex flex-col border-4 border-black text-mtext p-4 sm:p-16 bg-blue-900 grid-bg-dot justify-start items-center"
        >
            <div className="bg-white border-black border-2 w-full max-w-4xl shadow-light sm:shadow-lightLg flex justify-center items-start p-4 sm:p-8">
                {isLoading ? (
                    <p>Loading user data...</p>
                ) : (
                    <ProductForm />
                )}
            </div>
        </div>
    );
}

export default AddProducts;
