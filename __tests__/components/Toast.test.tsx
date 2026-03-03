import { render, screen, act } from "@testing-library/react-native";
import { Toast } from "@/src/components/ui/Toast";

describe("Toast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("renders message when visible", () => {
    render(<Toast visible message="Operação concluída" onDismiss={jest.fn()} />);
    expect(screen.getByText("Operação concluída")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { toJSON } = render(<Toast visible={false} message="Hidden" onDismiss={jest.fn()} />);
    expect(toJSON()).toBeNull();
  });

  it("calls onDismiss after duration", () => {
    const onDismiss = jest.fn();
    render(<Toast visible message="Auto dismiss" duration={2000} onDismiss={onDismiss} />);
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
