"use client";

import React, { useState } from "react";
import rawData from "@/data/quiz-data.json";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavigationMenu } from "@/components/ui/navigation-menu";

type CoffeeBean = {
  id: string;
  name: string;
  variety: string;
  roast: string | null;
  price: string;
  process: string;
  producer: string;
  country: string;
  webpage: string;
  image: string;
  flavors: string[];
  categorized_flavors: {
    [category: string]: string[];
  };
};

const quizData = rawData as CoffeeBean[];

const getAllCategories = (data: CoffeeBean[]) => {
  const categories = new Set<string>();
  data.forEach((bean) => {
    Object.keys(bean.categorized_flavors).forEach((cat) => {
      if (cat.trim() !== "") categories.add(cat);
    });
  });
  return Array.from(categories);
};

const QuizPage = () => {
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<CoffeeBean[]>([]);

  const categories = getAllCategories(quizData);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    const filtered = quizData.filter((bean) =>
      selectedCategories.some((cat) =>
        Object.keys(bean.categorized_flavors).includes(cat)
      )
    );
    setRecommendations(filtered);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* ✅ Navigation */}
      <NavigationMenu />

      {/* ✅ Centered Quiz */}
      <div className="flex-grow flex justify-center items-center w-full">
        <div className="w-full max-w-3xl px-4 text-center">
          {step === 0 ? (
            <>
              <h1 className="text-4xl font-bold mb-6">Coffee Flavor Quiz</h1>
              <p className="mb-6 text-gray-600 text-lg">
                Select the flavor profiles you enjoy:
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {categories
                  .filter((category) => category.trim() !== "")
                  .map((category) => (
                    <Button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    variant={selectedCategories.includes(category) ? "whiteBlack" : "neutral"}
                    size="default"
                    className="min-w-[110px] font-semibold"
                    >
                    {category}
                    </Button>
                  ))}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={selectedCategories.length === 0}
                variant="whiteBlack"
                className="w-full text-lg font-semibold rounded-lg px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Show Recommendations
                </Button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-6">Recommended Coffee Beans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((bean) => (
                  <Card
                    key={bean.id}
                    className="bg-white border shadow-sm p-4 rounded-lg text-left"
                  >
                    <img
                      src={bean.image}
                      alt={bean.name}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                    <h3 className="text-xl font-semibold mb-1">{bean.name}</h3>
                    <p className="text-sm text-gray-700 mb-1">
                      {bean.variety} • {bean.roast || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">From: {bean.country}</p>
                    <p className="text-sm text-gray-700 mb-1">
                      Flavors: {bean.flavors.join(", ")}
                    </p>
                    <a
                      href={bean.webpage}
                      target="_blank"
                      className="text-orange-600 text-sm font-medium mt-2 inline-block"
                    >
                      Buy Now →
                    </a>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;