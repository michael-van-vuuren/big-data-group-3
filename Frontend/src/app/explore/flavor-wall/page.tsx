"use client";

import { useState, useEffect } from "react";
import { flavorApi } from "@/lib/api";
import FlavorTags from "@/app/flavors/[...path]/components/FlavorTags";
import NoteTable from "@/sections/galaxy/menu/notetable";
import { FlavorDTO } from "@/lib/api/flavors";
import Spinner from "@/components/spinner";

export default function FlavorWall() {
  const [flavors, setFlavors] = useState<FlavorDTO[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    flavorApi.getAllFlavors()
      .then(setFlavors)
      .catch((e) => console.error("Failed to load flavors", e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("selectedSubCategory");
      setSelectedSubCategory(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.error("Failed to parse selectedSubCategory", e);
    }
  }, []);

  const addFlavorToSelection = (flavorName: string) => {
    setSelectedSubCategory((prev) => {
      if (!prev.includes(flavorName)) {
        const updated = [...prev, flavorName];
        sessionStorage.setItem("selectedSubCategory", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const removeFlavorFromSelection = (flavorName: string) => {
    const updated = selectedSubCategory.filter((name) => name !== flavorName);
    sessionStorage.setItem("selectedSubCategory", JSON.stringify(updated));
    setSelectedSubCategory(updated);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "-16px",
        width: "100vw",
        height: "calc(100vh - 58px)",
        overflow: "hidden",
      }}
      className="my-4 w-full lg:border-4 sm:border-t-2 border-border text-mtext flex flex-col"
    >
      {loading ? (
        <div className="bg-white h-full">
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-full overflow-y-auto flex flex-col items-center">
          {/* Flavor wall */}
          <div className="flex z-1 bg-white w-full py-8 justify-center items-center">
            <div className="w-3/4 lg:w-1/3">
              <FlavorTags
                flavorNames={flavors}
                onFlavorClick={addFlavorToSelection}
              />
            </div>
          </div>

          {/* Sticky bottom bar */}
          <div className="z-2 sticky w-full bottom-0 bg-white p-2 border-black border-t-[4px] px-16">
            <div className="max-w-md mx-auto w-full h-[9.6rem] overflow-y-auto">
              <NoteTable
                subcategories={selectedSubCategory}
                onRemoveNote={removeFlavorFromSelection}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
