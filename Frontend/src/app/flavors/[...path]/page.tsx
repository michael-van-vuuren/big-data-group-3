"use client";

import { useState } from "react";
import { Mesh } from "three";

import Galaxy from "@/sections/galaxy/scene/galaxy";
import PlanetMenu from "@/sections/galaxy/menu/galaxymenu";
import { usePlanetData } from "@/sections/galaxy/hooks/usePlanetData";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ProductDisplay from "./ProductDisplay";
import { useProductSearch } from "./useProductSearch";
import type { PlanetData } from "@/sections/galaxy/types/planetdata";

const systems = [
  { name: "Fruity System", link: "/flavors/Fruity" },
  { name: "Herbal System", link: "/flavors/Herbal" },
  { name: "Sweet System", link: "/flavors/Sweet" },
  { name: "Savory System", link: "/flavors/Savory" },
  { name: "Warm System", link: "/flavors/Warm" },
];

export default function NotesPage({ params }: { params: { path?: string[] } }) {
  const path = params.path ?? [];
  const currentSystemPath = path[0];
  const [targetRef, setTargetRef] = useState<Mesh | null>(null);
  const [reset, setReset] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showProductsView, setShowProductsView] = useState(false);

  const planetDataRef = usePlanetData(path);
  const isMobile = useIsMobile();

  const {
    matchingProducts,
    loadingProducts,
    productError,
    triggerProductSearch,
    handleCloseProductsView,
  } = useProductSearch(setShowProductsView, setReset);

  const handleSelection = (planet: PlanetData) => {
    if (showProductsView) handleCloseProductsView();
    setSelectedCategory(prev => (prev === planet.name ? null : planet.name));

    if (targetRef === planet.meshRef) {
      setReset(true);
      setSelectedCategory(null);
    } else {
      setTargetRef(planet.meshRef instanceof Mesh ? planet.meshRef : null);
      setReset(false);
      setSelectedCategory(planet.name);
    }
  };

  const handleResetComplete = () => {
    setTargetRef(null);
    setReset(false);
    setSelectedCategory(null);
  };

  const leftPanelInitialSize = 40;
  const galaxyPanelSize = isMobile ? 60 : 100 - leftPanelInitialSize;
  const menuPanelSize = isMobile ? 50 : leftPanelInitialSize;
  const menuPanelMinSize = isMobile ? 30 : 40;

  return (
    <div
      style={{
        position: "absolute",
        top: "-16px",
        width: "100vw",
        height: "calc(100vh - 58px)",
        overflow: "auto",
      }}
      className="my-4 w-full border-4 border-border text-mtext"
    >
      {showProductsView ? (
        <ProductDisplay
          loading={loadingProducts}
          products={matchingProducts}
          error={productError}
          onClose={handleCloseProductsView}
        />
      ) : (
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          <ResizablePanel defaultSize={galaxyPanelSize}>
            <div className="w-full h-full overflow-hidden">
              <Galaxy
                planetData={planetDataRef.current}
                targetRef={targetRef}
                handleSelection={handleSelection}
                reset={reset}
                onResetComplete={handleResetComplete}
                path={currentSystemPath}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel
            defaultSize={menuPanelSize}
            minSize={menuPanelMinSize}
            className={`${isMobile ? "min-h-[20%]" : "min-w-[30%]"} overflow-hidden`}
          >
            <PlanetMenu
              planetData={planetDataRef.current}
              path={currentSystemPath}
              selectedCategory={selectedCategory}
              handleSelection={handleSelection}
              systems={systems}
              onShowProducts={triggerProductSearch}
              isParentLoading={loadingProducts}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
