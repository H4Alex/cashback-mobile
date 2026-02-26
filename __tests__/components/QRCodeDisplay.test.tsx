import { render, screen } from "@testing-library/react-native";
import { QRCodeDisplay } from "@/src/components/QRCodeDisplay";

jest.mock("@/src/hooks/useCountdown", () => ({
  useCountdown: jest.fn(() => ({
    formatted: "4:30",
    isUrgent: false,
    isExpired: false,
  })),
}));

describe("QRCodeDisplay", () => {
  it("renders token preview", () => {
    render(
      <QRCodeDisplay
        token="abc123def456ghi789jkl012mno345pqr678"
        valor={25.5}
        empresaNome="Loja Central"
        expiresAt="2025-12-31T23:59:59Z"
      />,
    );
    expect(screen.getByText(/abc123def456ghi789j/)).toBeTruthy();
  });

  it("renders empresa name", () => {
    render(
      <QRCodeDisplay
        token="abc123def456ghi789jkl012mno345pqr678"
        valor={25.5}
        empresaNome="Loja Central"
        expiresAt="2025-12-31T23:59:59Z"
      />,
    );
    expect(screen.getByText("Loja Central")).toBeTruthy();
  });

  it("renders formatted valor", () => {
    render(
      <QRCodeDisplay
        token="abc123def456ghi789jkl012mno345pqr678"
        valor={25.5}
        empresaNome="Loja Central"
        expiresAt="2025-12-31T23:59:59Z"
      />,
    );
    expect(screen.getByText(/25,50/)).toBeTruthy();
  });

  it("renders instruction text", () => {
    render(
      <QRCodeDisplay
        token="abc123def456ghi789jkl012mno345pqr678"
        valor={10}
        empresaNome="Loja"
        expiresAt="2025-12-31T23:59:59Z"
      />,
    );
    expect(screen.getByText("Apresente ao caixa")).toBeTruthy();
  });
});
