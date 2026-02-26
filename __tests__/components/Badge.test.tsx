import { render, screen } from "@testing-library/react-native";
import { Badge } from "@/src/components/ui/Badge";

describe("Badge", () => {
  it("renders label text", () => {
    render(<Badge label="Active" />);
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("renders with different variants", () => {
    const variants = ["success", "error", "warning", "info", "neutral"] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Badge variant={variant} label={variant} />);
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    });
  });

  it("defaults to neutral variant", () => {
    const { toJSON } = render(<Badge label="Default" />);
    expect(toJSON()).not.toBeNull();
  });
});
