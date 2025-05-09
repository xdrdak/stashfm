"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

export function Layout(props: {
  barContent: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleExpand = () => {
    setIsTransitioning(true);
    setIsExpanded(!isExpanded);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the transition duration
  };

  return (
    <div
      id="page-layout"
      className="min-h-screen flex flex-col relative overflow-hidden color-shifting-background"
    >
      <main className="flex-grow">{/* Main content area */}</main>

      {/* Sticky footer */}
      <footer
        className={`sticky bottom-0 w-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-500 ease-in-out ${
          isExpanded ? "h-[90vh]" : "h-16"
        } ${isTransitioning ? "overflow-hidden" : ""}`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-8">
          <div className="flex-1">{props.barContent}</div>
          <Button
            className="w-8"
            variant="ghost"
            size="icon"
            onClick={toggleExpand}
            aria-label={isExpanded ? "Collapse footer" : "Expand footer"}
          >
            {isExpanded ? (
              <ChevronDown className="h-6 w-6" />
            ) : (
              <ChevronUp className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Expanded content with table */}
        <div
          className={`w-full h-[calc(90vh-4rem)] ${
            isExpanded ? "block" : "hidden"
          } ${
            isTransitioning ? "overflow-hidden" : "overflow-y-auto"
          } border-t border-t-gray-300 border-solid`}
        >
          <div className="container mx-auto px-4 h-full py-4">
            {props.children}
          </div>
        </div>
      </footer>
    </div>
  );
}
