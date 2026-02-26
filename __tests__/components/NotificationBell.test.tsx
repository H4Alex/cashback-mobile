import { render, screen, fireEvent } from "@testing-library/react-native";
import { NotificationBell } from "@/src/components/NotificationBell";

let mockUnreadCount = 0;

jest.mock("@/src/stores", () => ({
  useNotificationStore: (selector: (s: { unreadCount: number }) => number) =>
    selector({ unreadCount: mockUnreadCount }),
}));

describe("NotificationBell", () => {
  beforeEach(() => {
    mockUnreadCount = 0;
  });

  it("renders bell icon", () => {
    render(<NotificationBell onPress={jest.fn()} />);
    expect(screen.getByText("🔔")).toBeTruthy();
  });

  it("hides badge when unreadCount is 0", () => {
    mockUnreadCount = 0;
    render(<NotificationBell onPress={jest.fn()} />);
    expect(screen.queryByText("0")).toBeNull();
  });

  it("shows badge with count when unreadCount > 0", () => {
    mockUnreadCount = 5;
    render(<NotificationBell onPress={jest.fn()} />);
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("shows 99+ when unreadCount > 99", () => {
    mockUnreadCount = 150;
    render(<NotificationBell onPress={jest.fn()} />);
    expect(screen.getByText("99+")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<NotificationBell onPress={onPress} />);
    fireEvent.press(screen.getByText("🔔"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
