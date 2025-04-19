import { useState, useEffect } from "react";
import Link from 'next/link';

import Categories from "./categories";
import Subcategories from "./subcategories";
import NoteTable from "@/sections/notetable";
import notesData from "@/data/tasting-notes-wheel.json";
import type { PlanetData } from "@/sections/galaxy/types/planetdata";
import { Button } from '@/components/ui/button';

import { ProductSearchQuery } from "@/context/ProductSearchContext";
import { FlavorSearchQuery } from "@/context/ProductSearchContext";

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
  onShowProducts: (query: ProductSearchQuery) => void;
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
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem("selectedSubCategory") : null;
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse selectedSubCategory from sessionStorage", e);
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
      sessionStorage.setItem("selectedSubCategory", JSON.stringify(selectedSubCategory));
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

  const handleAnyClick = (flavorNames: string[]) => {
    // Build flavor query for any click (strict=false)
    const query: FlavorSearchQuery = {
      type: 'flavor',
      values: flavorNames,
      strict: false
    };
    onShowProducts(query);
  };

  const handleAllClick = (flavorNames: string[]) => {
    // Build flavor query for all click (strict=true)
    const query: FlavorSearchQuery = {
      type: 'flavor',
      values: flavorNames,
      strict: true
    };
    onShowProducts(query);
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
        <NoteTable
          subcategories={selectedSubCategory}
          onRemoveNote={toggleButton}
        />
      </div>

      <div className="mt-auto w-full flex flex-row justify-center gap-2 sm:gap-4 border-black border-2 py-4 px-6 border-b-8">
        <Button
          onClick={() => handleAnyClick(selectedSubCategory)}
          disabled={selectedSubCategory.length === 0 || isParentLoading}
          size="lg"
          variant="reverse"
          className="bg-emerald-600 p-2 text-sm text-white"
        >
          {isParentLoading ? "Loading Products..." : "Products With Any Notes"}
        </Button>
        <Button
          onClick={() => handleAllClick(selectedSubCategory)}
          disabled={selectedSubCategory.length === 0 || isParentLoading}
          size="lg"
          variant="reverse"
          className="bg-red-500 p-2 text-sm text-white"
        >
          {isParentLoading ? "Loading Products..." : "Products With All Notes"}
        </Button>
      </div>
    </div>
  );
}
