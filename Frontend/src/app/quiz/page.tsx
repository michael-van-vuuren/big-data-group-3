"use client";

import React, { useState } from "react";
import rawData from "@/data/quiz-data.json";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getNoteColor } from "@/lib/colorutils";

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
  const [clickedCategories, setClickedCategories] = useState<string[]>([]);

  const categories = getAllCategories(quizData);

  const handleCategoryToggle = (category: string) => {
    // Toggle selection
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );

    // Toggle clicked
    setClickedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  console.log(selectedCategories);

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
    <div className="bg-white border-border border-4 flex items-center justify-center w-screen relative" style={{ height: "calc(100vh - 58px)" }}>
      <div className="text-start h-full py-24">
        {step === 0 ? (
          <>
            <h1 className="text-4xl font-bold mb-6">Coffee Preference Quiz</h1>
            <p className="mb-6 text-md">
              1. Select the types of flavor notes you enjoy
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {categories
                .filter((category) => category.trim() !== "")
                .map((category) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    variant="default"
                    size="lg"
                    color={clickedCategories.includes(category) ? "#475773" : getNoteColor(category)}
                    className={
                      clickedCategories.includes(category)
                        ? "text-white shadow-none bg-black translate-x-boxShadowX translate-y-boxShadowY"
                        : "text-white shadow-light"
                    }
                  >
                    {category}
                  </Button>
                ))}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={selectedCategories.length === 0}
              variant="default"
              className="text-md px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default QuizPage;
