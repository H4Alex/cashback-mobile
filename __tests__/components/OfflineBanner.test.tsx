import { render, screen } from "@testing-library/react-native";
import { OfflineBanner } from "@/src/components/OfflineBanner";

describe("OfflineBanner", () => {
  it("renders banner when visible is true", () => {
    render(<OfflineBanner visible />);
    expect(screen.getByText(/Sem conexão/)).toBeTruthy();
  });

  it("does not render when visible is false", () => {
    const { toJSON } = render(<OfflineBanner visible={false} />);
    expect(toJSON()).toBeNull();
  });
});
