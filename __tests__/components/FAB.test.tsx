import { render, screen, fireEvent } from "@testing-library/react-native";
import { FAB } from "@/src/components/FAB";

describe("FAB", () => {
  it("renders label", () => {
    render(<FAB label="+" onPress={jest.fn()} />);
    expect(screen.getByText("+")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<FAB label="+" onPress={onPress} />);
    fireEvent.press(screen.getByText("+"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
