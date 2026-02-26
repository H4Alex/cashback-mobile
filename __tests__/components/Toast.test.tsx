import { render, screen } from "@testing-library/react-native";
import { Toast } from "@/src/components/ui/Toast";

describe("Toast", () => {
  it("renders message when visible", () => {
    render(<Toast visible message="Operação concluída" onDismiss={jest.fn()} />);
    expect(screen.getByText("Operação concluída")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { toJSON } = render(<Toast visible={false} message="Hidden" onDismiss={jest.fn()} />);
    expect(toJSON()).toBeNull();
  });
});
