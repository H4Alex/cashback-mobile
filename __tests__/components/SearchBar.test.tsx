import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { SearchBar } from "@/src/components/SearchBar";

jest.useFakeTimers();

describe("SearchBar", () => {
  it("renders with placeholder", () => {
    render(<SearchBar value="" onChangeText={jest.fn()} placeholder="Buscar..." />);

    expect(screen.getByPlaceholderText("Buscar...")).toBeTruthy();
  });

  it("displays current value", () => {
    render(<SearchBar value="test query" onChangeText={jest.fn()} />);

    const input = screen.getByDisplayValue("test query");
    expect(input).toBeTruthy();
  });

  it("debounces onChangeText calls", () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChangeText={onChange} debounceMs={300} />);

    const input = screen.getByPlaceholderText("Buscar...");
    fireEvent.changeText(input, "a");
    fireEvent.changeText(input, "ab");
    fireEvent.changeText(input, "abc");

    // Before debounce completes
    expect(onChange).not.toHaveBeenCalled();

    // After debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("abc");
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
