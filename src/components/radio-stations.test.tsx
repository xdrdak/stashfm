import { describe, test, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RadioStationsList } from "./radio-stations";
import { radioStationsStore } from "../stores/radio-stations";

describe("RadioStationsList", () => {
  beforeEach(() => {
    // Ensure a clean state by resetting stations before each test
    radioStationsStore.stations = [];
  });

  test("displays no stations message when there are no stations", async () => {
    // ARRANGE
    render(<RadioStationsList />);

    // ACT
    // No specific user interaction is needed for this test after the initial render.

    // ASSERT
    expect(
      screen.getByText("No stations available. Add a new station.")
    ).toBeInTheDocument();
  });
});
