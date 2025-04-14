import { useState, useEffect } from "react";
import Link from 'next/link';

import Categories from "./categories";
import Subcategories from "./subcategories";
import NoteTable from "@/sections/notetable";
import notesData from "@/data/tasting-notes-wheel.json";
import type { PlanetData } from "@/sections/galaxy/types/planetdata";
import { Button } from '@/components/ui/button';

interface System {
  name: string;
  link: string;
}

interface PlanetMenuProps {
  planetData: PlanetData[];
  path: string | undefined;
  selectedCategory: string | null;
  handleSelection: (planet: PlanetData) => void;
  systems: System[];
  onShowProducts: (subCategories: string[]) => void;
  isParentLoading: boolean;
}

export default function PlanetMenu({
  planetData,
  path,
  selectedCategory,
  handleSelection,
  systems,
  onShowProducts,
  isParentLoading
}: PlanetMenuProps) {
  type NotePaths = keyof typeof notesData.Notes;

  const currentLevel: string[] | null =
    path && selectedCategory && path in notesData.Notes && selectedCategory in notesData.Notes[path as NotePaths]
      ? (notesData.Notes[path as NotePaths][selectedCategory as keyof typeof notesData.Notes[NotePaths]] as string[])
      : null;

  const [selectedSubCategory, setSelectedSubCategory] = useState<string[]>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem("selectedSubCategory") : null;
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse selectedSubCategory from localStorage", e);
      return [];
    }
  });

  const toggleButton = (note: string) => {
    setSelectedSubCategory((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedSubCategory", JSON.stringify(selectedSubCategory));
    }
  }, [selectedSubCategory]);

  let currentIndex = -1;
  if (path) {
    currentIndex = systems.findIndex(system => system.link === `/flavors/${path}`);
  }

  let prevSystem: System | null = null;
  let nextSystem: System | null = null;

  if (currentIndex !== -1 && systems.length > 0) {
    const prevIndex = (currentIndex - 1 + systems.length) % systems.length;
    const nextIndex = (currentIndex + 1) % systems.length;
    prevSystem = systems[prevIndex];
    nextSystem = systems[nextIndex];
  }

  const handleShowMatchingProductsClick = () => {
    onShowProducts(selectedSubCategory);
  };

  return (
    <div className="flex flex-col h-full items-center justify-start bg-white p-4 overflow-y-auto">
      <div className="w-full flex items-center justify-center space-x-2 sm:space-x-4 mb-6">
        {prevSystem ? (
          <Link href={prevSystem.link} passHref>
            <Button variant="reverse" size="sm">
              &lt; {prevSystem.name}
            </Button>
          </Link>
        ) : (
          <Button variant="reverse" size="sm" disabled>&lt; Prev</Button>
        )}

        <p className="bg-black text-white font-bold border-black border-2 p-2 sm:p-4 text-center whitespace-nowrap text-sm sm:text-base">
          {path ? `${path} System` : "Select System"}
        </p>

        {nextSystem ? (
          <Link href={nextSystem.link} passHref>
            <Button variant="reverse" size="sm">
              {nextSystem.name} &gt;
            </Button>
          </Link>
        ) : (
          <Button variant="reverse" size="sm" disabled>Next &gt;</Button>
        )}
      </div>

      <div className="w-full mb-4">
        <Categories
          planetData={planetData}
          selected={selectedCategory}
          handleSelection={handleSelection}
        />
      </div>

      {currentLevel && Array.isArray(currentLevel) && (
        <div className="w-full mb-4">
          <Subcategories
            notes={currentLevel}
            selected={selectedSubCategory}
            toggle={toggleButton}
          />
        </div>
      )}

      <div className="w-full overflow-x-auto mb-6 min-h-52">
        <NoteTable subcategories={selectedSubCategory} />
      </div>

      <div className="w-full flex justify-center mt-auto pt-4 pb-2">
        <Button
          onClick={handleShowMatchingProductsClick}
          disabled={selectedSubCategory.length === 0 || isParentLoading}
          size="lg"
        >
          {isParentLoading ? "Loading Products..." : "Show Matching Products"}
        </Button>
      </div>
    </div>
  );
}
