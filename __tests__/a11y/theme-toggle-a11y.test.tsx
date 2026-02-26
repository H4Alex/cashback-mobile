import { render, screen } from "@testing-library/react-native";
import { ThemeToggle } from "@/src/components/ThemeToggle";

jest.mock("@/src/theme", () => ({
  useTheme: jest.fn(() => ({
    mode: "system",
    setMode: jest.fn(),
  })),
}));

describe("ThemeToggle Accessibility", () => {
  it("has radiogroup role", () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText("Selecionar tema")).toBeTruthy();
  });

  it("each option has radio role", () => {
    render(<ThemeToggle />);
    const lightOption = screen.getByLabelText("Tema Claro");
    expect(lightOption.props.accessibilityRole).toBe("radio");

    const darkOption = screen.getByLabelText("Tema Escuro");
    expect(darkOption.props.accessibilityRole).toBe("radio");

    const systemOption = screen.getByLabelText("Tema Sistema");
    expect(systemOption.props.accessibilityRole).toBe("radio");
  });

  it("marks current theme as checked", () => {
    render(<ThemeToggle />);
    const systemOption = screen.getByLabelText("Tema Sistema");
    expect(systemOption.props.accessibilityState?.checked).toBe(true);

    const lightOption = screen.getByLabelText("Tema Claro");
    expect(lightOption.props.accessibilityState?.checked).toBe(false);
  });
});
