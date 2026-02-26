import { render, screen } from "@testing-library/react-native";
import { OfflineIndicator } from "@/src/components/OfflineIndicator";

describe("OfflineIndicator Accessibility", () => {
  it("has alert role for screen readers", () => {
    render(<OfflineIndicator isStale />);
    const indicator = screen.getByLabelText("Dados possivelmente desatualizados");
    expect(indicator.props.accessibilityRole).toBe("alert");
  });

  it("has descriptive accessibility label", () => {
    render(<OfflineIndicator isStale />);
    expect(screen.getByLabelText("Dados possivelmente desatualizados")).toBeTruthy();
  });
});
