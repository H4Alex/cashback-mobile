import { render, screen, fireEvent } from "@testing-library/react-native";
import { Button } from "@/src/components/ui/Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByText("Entrar")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Click</Button>);
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    const onPress = jest.fn();
    render(
      <Button onPress={onPress} disabled>
        Disabled
      </Button>,
    );
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows ActivityIndicator when loading", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.queryByText("Loading")).toBeNull();
  });

  it("is disabled when loading", () => {
    const onPress = jest.fn();
    render(
      <Button onPress={onPress} loading>
        Loading
      </Button>,
    );
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders with different variants", () => {
    const { unmount } = render(<Button variant="danger">Delete</Button>);
    expect(screen.getByText("Delete")).toBeTruthy();
    unmount();

    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByText("Outline")).toBeTruthy();
  });
});
