// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const siteMock = vi.hoisted(() => ({ appStoreUrl: null as string | null }));

vi.mock("@/lib/site", () => ({ site: siteMock }));

import { StoreBadge } from "@/components/store-badge";

describe("StoreBadge", () => {
  afterEach(() => {
    siteMock.appStoreUrl = null;
  });

  it("is a quiet label, not a control, while there is no listing", () => {
    const { container } = render(
      <StoreBadge label="Download" soonLabel="Coming soon" />
    );
    const soon = screen.getByText("Coming soon");

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(soon.tagName).toBe("SPAN");
    expect(container.querySelector("[aria-disabled]")).toBeNull();
    // No frame or fill: nothing that reads as a pressable button.
    expect(soon.className).not.toMatch(/\b(border|bg-|px-|rounded)/);
    expect(soon.className).toContain("text-text-secondary");
  });

  it("is a real link with the button look once the listing exists", () => {
    siteMock.appStoreUrl = "https://apps.apple.com/app/id0000000000";
    render(<StoreBadge label="Download" soonLabel="Coming soon" />);
    const link = screen.getByRole("link", { name: "Download" });

    expect(link.getAttribute("href")).toBe(
      "https://apps.apple.com/app/id0000000000"
    );
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.hasAttribute("target")).toBe(false);
    expect(link.className).toContain("bg-accent");
    expect(link.className).toContain("min-h-11");
    expect(screen.queryByText("Coming soon")).toBeNull();
  });
});
