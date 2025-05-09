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
    // Note: The component is expected to display "No stations available." when empty.
    // Please adjust this text if the component's actual message differs.
    const noStationsMessage = await screen.findByText("No stations available.");
    expect(noStationsMessage).toBeInTheDocument();
  });
});
