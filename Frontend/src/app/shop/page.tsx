'use client';

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
  process: string;
  producer: string;
  country: string;
  webpage: string;
  image: string | null;
  flavors?: string[];
};

const quizData = rawData as CoffeeBean[];

const ShopPage = () => {
  const [beans] = useState<CoffeeBean[]>(quizData);

  return (
    <div className="bg-white border-border border-4 flex items-center justify-center w-screen relative">
      <div className="text-start h-full py-24 px-16">
        <h1 className="text-4xl font-bold text-center mb-10">
          Shop For Coffee
        </h1>

        {beans.length === 0 && (
          <p className="text-center text-gray-500 text-lg">No coffee products available right now.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {beans.slice(0, 30).map((bean) => (
            <Card
              key={bean.id}
              className="bg-white p-4 rounded-lg text-left flex flex-col justify-between items-center"
            >
              {bean.image ? (
                <img
                  src={bean.image}
                  alt={bean.name}
                  className="w-full h-44 object-contain p-4 border-2 border-black mb-3 bg-gray-100"
                />
              ) : (
                <div className="w-full h-44 bg-gray-200 border-2 border-black mb-3 flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold mb-3">{bean.name}</h3>

                {/* Use grid for aligning keys and values with custom column sizes */}
                <div className="grid grid-cols-[70px_1fr] gap-2 text-sm text-gray-600 mb-1">
                  <p className="font-semibold">Variety:</p>
                  <p>{bean.variety || "Unknown Variety"}</p>
                  <p className="font-semibold">Roast:</p>
                  <p>{bean.roast || "Unknown Roast"}</p>
                  <p className="font-semibold">Producer:</p>
                  <p>{bean.producer} ({bean.country})</p>
                  {bean.flavors && bean.flavors.length > 0 && (
                    <>
                      <p className="font-semibold">Flavors:</p>
                      <p>{bean.flavors.join(", ")}</p>
                    </>
                  )}
                  <p className="font-semibold">Price:</p>
                  <p>${bean.price} {bean.gram ? `/ ${bean.gram}g` : ""}</p>
                </div>
              </div>

              <a
                href={bean.webpage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black font-medium text-center bg-white border-2 border-black py-2 px-4 mt-4 hover:bg-emerald-500"
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
