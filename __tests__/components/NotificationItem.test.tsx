import { render, screen, fireEvent } from "@testing-library/react-native";
import { NotificationItem, formatDateGroup } from "@/src/components/NotificationItem";
import type { MobileNotification } from "@/src/types";

const makeNotification = (overrides: Partial<MobileNotification> = {}): MobileNotification => ({
  id: 1,
  tipo: "cashback_recebido",
  titulo: "Cashback recebido",
  mensagem: "Você recebeu R$ 10,00 de cashback",
  lida: false,
  created_at: new Date().toISOString(),
  ...overrides,
});

describe("NotificationItem", () => {
  it("renders titulo and mensagem", () => {
    render(<NotificationItem item={makeNotification()} onPress={jest.fn()} />);
    expect(screen.getByText("Cashback recebido")).toBeTruthy();
    expect(screen.getByText(/R\$ 10,00/)).toBeTruthy();
  });

  it("shows correct icon for cashback_recebido type", () => {
    render(<NotificationItem item={makeNotification({ tipo: "cashback_recebido" })} onPress={jest.fn()} />);
    expect(screen.getByText("🟢")).toBeTruthy();
  });

  it("shows unread indicator for unread notifications", () => {
    const { toJSON } = render(
      <NotificationItem item={makeNotification({ lida: false })} onPress={jest.fn()} />,
    );
    expect(toJSON()).not.toBeNull();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<NotificationItem item={makeNotification()} onPress={onPress} />);
    fireEvent.press(screen.getByText("Cashback recebido"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("formatDateGroup", () => {
  it("returns Hoje for today", () => {
    expect(formatDateGroup(new Date().toISOString())).toBe("Hoje");
  });

  it("returns Ontem for yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatDateGroup(yesterday.toISOString())).toBe("Ontem");
  });

  it("returns formatted date for older dates", () => {
    const old = new Date("2024-06-15T10:00:00Z");
    const result = formatDateGroup(old.toISOString());
    expect(result).toContain("15");
  });
});
