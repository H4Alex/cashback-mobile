import { render, screen } from "@testing-library/react-native";
import { CountdownTimer } from "@/src/components/CountdownTimer";

jest.mock("@/src/hooks/useCountdown", () => ({
  useCountdown: jest.fn(),
}));

import { useCountdown } from "@/src/hooks/useCountdown";

describe("CountdownTimer", () => {
  it("renders formatted time when not expired", () => {
    (useCountdown as jest.Mock).mockReturnValue({
      formatted: "4:30",
      isUrgent: false,
      isExpired: false,
    });
    render(<CountdownTimer expiresAt="2025-12-31T23:59:59Z" />);
    expect(screen.getByText("4:30")).toBeTruthy();
    expect(screen.getByText("Expira em")).toBeTruthy();
  });

  it("renders Expirado when expired", () => {
    (useCountdown as jest.Mock).mockReturnValue({
      formatted: "0:00",
      isUrgent: false,
      isExpired: true,
    });
    render(<CountdownTimer expiresAt="2020-01-01T00:00:00Z" />);
    expect(screen.getByText("Expirado")).toBeTruthy();
  });

  it("shows urgent styling when isUrgent", () => {
    (useCountdown as jest.Mock).mockReturnValue({
      formatted: "0:45",
      isUrgent: true,
      isExpired: false,
    });
    render(<CountdownTimer expiresAt="2025-12-31T23:59:59Z" />);
    expect(screen.getByText("0:45")).toBeTruthy();
  });
});
