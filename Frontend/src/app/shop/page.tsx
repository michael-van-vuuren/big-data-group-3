"use client";

import React, { useState } from "react";
import rawData from "@/data/quiz-data.json";
import { Card } from "@/components/ui/card";

type CoffeeBean = {
  id: string;
  name: string;
  variety: string;
  roast: string | null;
  price: string;
  gram?: string;
  availability: string;
  process: string;
  producer: string;
  country: string;
  webpage: string;
  image: string | null;
  flavors?: string[];
};

const quizData = rawData as CoffeeBean[];

const ShopPage = () => {
  const [beans] = useState<CoffeeBean[]>(
    quizData.filter((bean) => bean.availability === "YES")
  );

  return (
    <div className="bg-white border-border border-4 flex items-center justify-center w-screen relative">
      <div className="text-start h-full py-24 px-16">
        <h1 className="text-4xl font-bold text-center mb-10">
          ☕ Explore Our Coffee Collection
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {beans.map((bean) => (
            <Card
              key={bean.id}
              className="bg-white border shadow-sm p-4 rounded-lg text-left flex flex-col justify-between"
            >
              {bean.image ? (
                <img
                  src={bean.image}
                  alt={bean.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold mb-1">{bean.name}</h3>
                <p className="text-sm text-gray-600 mb-1 italic">
                  {bean.roast || "Unknown Roast"} •{" "}
                  {bean.variety || "Unknown Variety"}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  {bean.producer} ({bean.country})
                </p>
                {bean.flavors && (
                  <p className="text-sm text-gray-700 mb-1">
                    Flavors: {bean.flavors.slice(0, 3).join(", ")}
                  </p>
                )}
                <p className="text-lg font-bold mt-2 mb-3">
                  ${bean.price} {bean.gram ? `/ ${bean.gram}g` : ""}
                </p>
              </div>

              <a
                href={bean.webpage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white font-medium text-center bg-black py-2 px-4 rounded hover:bg-gray-800 transition"
              >
                Buy Now →
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
