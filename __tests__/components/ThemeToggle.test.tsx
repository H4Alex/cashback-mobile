import { render, screen, fireEvent } from "@testing-library/react-native";
import { ThemeToggle } from "@/src/components/ThemeToggle";

jest.mock("@/src/theme", () => ({
  useTheme: jest.fn(() => ({
    mode: "system",
    setMode: jest.fn(),
  })),
}));

import { useTheme } from "@/src/theme";

describe("ThemeToggle", () => {
  const mockSetMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      mode: "system",
      setMode: mockSetMode,
    });
  });

  it("renders theme label", () => {
    render(<ThemeToggle />);
    expect(screen.getByText("Tema")).toBeTruthy();
  });

  it("renders all three options", () => {
    render(<ThemeToggle />);
    expect(screen.getByText("Claro")).toBeTruthy();
    expect(screen.getByText("Escuro")).toBeTruthy();
    expect(screen.getByText("Sistema")).toBeTruthy();
  });

  it("calls setMode with light when Claro is pressed", () => {
    render(<ThemeToggle />);
    fireEvent.press(screen.getByText("Claro"));
    expect(mockSetMode).toHaveBeenCalledWith("light");
  });

  it("calls setMode with dark when Escuro is pressed", () => {
    render(<ThemeToggle />);
    fireEvent.press(screen.getByText("Escuro"));
    expect(mockSetMode).toHaveBeenCalledWith("dark");
  });

  it("has accessibility radiogroup role", () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText("Selecionar tema")).toBeTruthy();
  });
});
