import { render, screen } from "@testing-library/react-native";
import { OfflineIndicator } from "@/src/components/OfflineIndicator";

describe("OfflineIndicator", () => {
  it("renders when isStale is true", () => {
    render(<OfflineIndicator isStale />);
    expect(screen.getByText(/possivelmente desatualizados/)).toBeTruthy();
  });

  it("does not render when isStale is false", () => {
    const { toJSON } = render(<OfflineIndicator isStale={false} />);
    expect(toJSON()).toBeNull();
  });

  it("does not render by default", () => {
    const { toJSON } = render(<OfflineIndicator />);
    expect(toJSON()).toBeNull();
  });

  it("has correct accessibility attributes", () => {
    render(<OfflineIndicator isStale />);
    expect(screen.getByLabelText("Dados possivelmente desatualizados")).toBeTruthy();
  });
});
