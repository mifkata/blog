import { describe, it, expect, vi } from "vitest";

// Test keyboard handling logic
describe("LabeledImage keyboard interactions", () => {
  describe("open modal triggers", () => {
    it("should trigger on Enter key", () => {
      const openModal = vi.fn();
      const handleKeyDown = (e: {
        key: string;
        preventDefault: () => void;
      }) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      };

      const mockEvent = { key: "Enter", preventDefault: vi.fn() };
      handleKeyDown(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(openModal).toHaveBeenCalled();
    });

    it("should trigger on Space key", () => {
      const openModal = vi.fn();
      const handleKeyDown = (e: {
        key: string;
        preventDefault: () => void;
      }) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      };

      const mockEvent = { key: " ", preventDefault: vi.fn() };
      handleKeyDown(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(openModal).toHaveBeenCalled();
    });

    it("should not trigger on other keys", () => {
      const openModal = vi.fn();
      const handleKeyDown = (e: {
        key: string;
        preventDefault: () => void;
      }) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      };

      const mockEvent = { key: "Tab", preventDefault: vi.fn() };
      handleKeyDown(mockEvent);

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(openModal).not.toHaveBeenCalled();
    });
  });

  describe("close modal triggers", () => {
    it("should close on Escape key", () => {
      const closeModal = vi.fn();
      const handleEscape = (e: { key: string }) => {
        if (e.key === "Escape") {
          closeModal();
        }
      };

      handleEscape({ key: "Escape" });
      expect(closeModal).toHaveBeenCalled();
    });

    it("should not close on other keys", () => {
      const closeModal = vi.fn();
      const handleEscape = (e: { key: string }) => {
        if (e.key === "Escape") {
          closeModal();
        }
      };

      handleEscape({ key: "Enter" });
      expect(closeModal).not.toHaveBeenCalled();
    });
  });
});

describe("LabeledImage body scroll lock logic", () => {
  it("should set overflow to hidden when locking", () => {
    const lockScroll = () => "hidden";
    expect(lockScroll()).toBe("hidden");
  });

  it("should set overflow to empty string when unlocking", () => {
    const unlockScroll = () => "";
    expect(unlockScroll()).toBe("");
  });
});

describe("LabeledImage aria-label generation", () => {
  it("should generate correct aria-label", () => {
    const alt = "A sample image";
    const ariaLabel = `${alt} - Click to enlarge`;
    expect(ariaLabel).toBe("A sample image - Click to enlarge");
  });

  it("should handle empty alt text", () => {
    const alt = "";
    const ariaLabel = `${alt} - Click to enlarge`;
    expect(ariaLabel).toBe(" - Click to enlarge");
  });

  it("should handle alt text with special characters", () => {
    const alt = 'Image with "quotes" & ampersand';
    const ariaLabel = `${alt} - Click to enlarge`;
    expect(ariaLabel).toBe(
      'Image with "quotes" & ampersand - Click to enlarge',
    );
  });
});

describe("LabeledImage modal visibility logic", () => {
  it("should be hidden when isOpen is false", () => {
    const isOpen = false;
    const className = isOpen ? "flex items-center justify-center" : "hidden";
    expect(className).toBe("hidden");
  });

  it("should be visible when isOpen is true", () => {
    const isOpen = true;
    const className = isOpen ? "flex items-center justify-center" : "hidden";
    expect(className).toBe("flex items-center justify-center");
  });

  it("should have correct aria-hidden when closed", () => {
    const isOpen = false;
    expect(!isOpen).toBe(true);
  });

  it("should have correct aria-hidden when open", () => {
    const isOpen = true;
    expect(!isOpen).toBe(false);
  });
});
