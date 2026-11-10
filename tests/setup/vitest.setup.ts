// Runs before every test file, jsdom or node alike. jest-dom only registers
// expect matchers; @testing-library/react's module body only touches
// `document` inside functions the node-environment specs never call.
import "@testing-library/jest-dom/vitest";

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Vitest runs without test.globals here, so Testing Library cannot register
// its own afterEach cleanup; wire it by hand.
afterEach(() => {
  cleanup();
});
