import { render, screen } from "@testing-library/react-native";
import { BiometricPrompt } from "@/src/components/BiometricPrompt";

describe("BiometricPrompt Accessibility", () => {
  const defaultProps = {
    onAuthenticate: jest.fn().mockResolvedValue(true),
    onFallback: jest.fn(),
  };

  it("biometric icon has accessibility label", () => {
    render(<BiometricPrompt {...defaultProps} />);
    expect(screen.getByLabelText("Autenticação biométrica")).toBeTruthy();
  });

  it("authenticate button has accessibility label and role", () => {
    render(<BiometricPrompt {...defaultProps} />);
    const button = screen.getByLabelText("Autenticar com biometria");
    expect(button).toBeTruthy();
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("fallback button has accessibility label and role", () => {
    render(<BiometricPrompt {...defaultProps} />);
    const button = screen.getByLabelText("Usar senha em vez de biometria");
    expect(button).toBeTruthy();
    expect(button.props.accessibilityRole).toBe("button");
  });
});
