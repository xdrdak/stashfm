"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { subscribe } from "valtio";
import { radioStore } from "@/stores/radio";

export function Layout(props: {
  barContent: React.ReactNode;
  expanderContent: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  usePageLayoutAnimation();

  return (
    <div
      id="page-layout"
      className="min-h-screen flex flex-col relative overflow-hidden color-shifting-background"
      style={{
        animationPlayState: "paused",
      }}
    >
      <main className="flex-grow">{props.children}</main>

      {/* Sticky footer */}
      <footer
        className={`sticky bottom-0 w-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-500 ease-in-out ${
          isExpanded ? "h-[90vh] overflow-hidden" : "md:h-16 h-18"
        }`}
      >
        <div className="container mx-auto px-4 md:h-16 h-18 flex items-center justify-between gap-6">
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
            isExpanded ? "block overflow-y-auto" : "hidden"
          } border-t border-t-gray-300 border-solid`}
        >
          <div className="container mx-auto px-4 h-full py-4">
            {props.expanderContent}
          </div>
        </div>
      </footer>
    </div>
  );
}

function usePageLayoutAnimation() {
  useEffect(() => {
    const unsubscribe = subscribe(radioStore, () => {
      const pageLayout = document.getElementById("page-layout");
      if (pageLayout) {
        if (radioStore.isPlaying === true) {
          pageLayout.style.animationPlayState = "running";
        } else {
          pageLayout.style.animationPlayState = "paused";
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
}
