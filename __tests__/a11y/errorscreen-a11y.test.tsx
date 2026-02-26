import { render, screen } from "@testing-library/react-native";
import { ErrorScreen } from "@/src/components/ErrorScreen";

describe("ErrorScreen Accessibility", () => {
  it("retry button has accessibility label and role", () => {
    render(<ErrorScreen onRetry={jest.fn()} />);
    const button = screen.getByLabelText("Tentar novamente");
    expect(button).toBeTruthy();
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("displays readable error title", () => {
    render(<ErrorScreen type="network" />);
    expect(screen.getByText("Sem conexão")).toBeTruthy();
  });

  it("displays readable error message", () => {
    render(<ErrorScreen type="network" />);
    expect(screen.getByText(/Verifique sua internet/)).toBeTruthy();
  });
});
