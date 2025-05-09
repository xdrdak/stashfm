import { describe, expect, test, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { RadioStationsList } from "./radio-stations";
import { radioStationsStore } from '../stores/radio-stations';

describe('RadioStationsList', () => {
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
    // Note: The message "No stations available. Add one to get started!" is an assumption.
    // Please adjust it if your component uses a different message.
    const noStationsMessage = await screen.findByText("No stations available. Add one to get started!");
    expect(noStationsMessage).toBeInTheDocument();
  });
});
