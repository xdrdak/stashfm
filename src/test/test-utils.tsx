import React from "react";
import { render, RenderOptions } from "@testing-library/react";

const Wrapper = (props: { children: React.ReactNode }) => {
  return <>{props.children}</>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Wrapper, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
