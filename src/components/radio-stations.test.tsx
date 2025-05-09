import { describe, expect, test } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { RadioStationsList } from "./radio-stations";

describe('RadioStationsList', () => {
  test("displays no stations message when there are no stations", async () => {
    // ARRANGE
    render(<RadioStationsList />);

    // ACT

    // ASSERT
    expect(screen.getByText("Station")).toBeInTheDocument();
  });
});
