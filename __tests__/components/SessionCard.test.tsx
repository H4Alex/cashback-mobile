import { render, screen, fireEvent } from "@testing-library/react-native";
import { SessionCard } from "@/src/components/SessionCard";

const baseSession = {
  id: "sess-1",
  device_name: "iPhone 15",
  platform: "iOS 17.0",
  is_current: false,
  last_active_at: new Date().toISOString(),
};

describe("SessionCard", () => {
  it("renders device name and platform", () => {
    render(<SessionCard session={baseSession} onRevoke={jest.fn()} isRevoking={false} />);
    expect(screen.getByText("iPhone 15")).toBeTruthy();
    expect(screen.getByText("iOS 17.0")).toBeTruthy();
  });

  it("shows Atual badge for current session", () => {
    render(
      <SessionCard
        session={{ ...baseSession, is_current: true }}
        onRevoke={jest.fn()}
        isRevoking={false}
      />,
    );
    expect(screen.getByText("Atual")).toBeTruthy();
  });

  it("hides revoke button for current session", () => {
    render(
      <SessionCard
        session={{ ...baseSession, is_current: true }}
        onRevoke={jest.fn()}
        isRevoking={false}
      />,
    );
    expect(screen.queryByText("Revogar")).toBeNull();
  });

  it("shows revoke button for non-current session", () => {
    render(<SessionCard session={baseSession} onRevoke={jest.fn()} isRevoking={false} />);
    expect(screen.getByText("Revogar")).toBeTruthy();
  });

  it("calls onRevoke with session id when revoke is pressed", () => {
    const onRevoke = jest.fn();
    render(<SessionCard session={baseSession} onRevoke={onRevoke} isRevoking={false} />);
    fireEvent.press(screen.getByText("Revogar"));
    expect(onRevoke).toHaveBeenCalledWith("sess-1");
  });
});
