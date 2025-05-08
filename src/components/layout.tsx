"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
// Gener
export function Layout(props: {
  barContent: React.ReactNode;
  children: React.ReactNode;
}) {
  const [backgroundColor, setBackgroundColor] = useState("rgb(100, 100, 200)");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Function to generate a random RGB color
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Change background color every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundColor(generateRandomColor());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundColor,
        transition: "background-color 2s ease",
      }}
    >
      <main className="flex-grow">{/* Main content area */}</main>

      {/* Sticky footer */}
      <footer
        className={`sticky bottom-0 w-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-500 ease-in-out ${
          isExpanded ? "h-[90vh]" : "h-16"
        } ${isTransitioning ? "overflow-hidden" : ""}`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between ">
          {props.barContent}
          <Button
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
