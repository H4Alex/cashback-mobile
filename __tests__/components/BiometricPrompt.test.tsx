import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { BiometricPrompt } from "@/src/components/BiometricPrompt";

describe("BiometricPrompt", () => {
  it("renders title and buttons", () => {
    render(
      <BiometricPrompt
        onAuthenticate={jest.fn().mockResolvedValue(true)}
        onFallback={jest.fn()}
      />,
    );
    expect(screen.getByText("Autenticação Biométrica")).toBeTruthy();
    expect(screen.getByText("Autenticar")).toBeTruthy();
    expect(screen.getByText("Usar senha")).toBeTruthy();
  });

  it("calls onAuthenticate when Autenticar is pressed", async () => {
    const onAuth = jest.fn().mockResolvedValue(true);
    render(<BiometricPrompt onAuthenticate={onAuth} onFallback={jest.fn()} />);
    fireEvent.press(screen.getByText("Autenticar"));
    await waitFor(() => expect(onAuth).toHaveBeenCalledTimes(1));
  });

  it("calls onFallback when Usar senha is pressed", () => {
    const onFallback = jest.fn();
    render(
      <BiometricPrompt
        onAuthenticate={jest.fn().mockResolvedValue(true)}
        onFallback={onFallback}
      />,
    );
    fireEvent.press(screen.getByText("Usar senha"));
    expect(onFallback).toHaveBeenCalledTimes(1);
  });

  it("shows error on failed auth attempt", async () => {
    const onAuth = jest.fn().mockResolvedValue(false);
    render(<BiometricPrompt onAuthenticate={onAuth} onFallback={jest.fn()} maxAttempts={3} />);
    fireEvent.press(screen.getByText("Autenticar"));
    await waitFor(() => expect(screen.getByText(/Falha na autenticação/)).toBeTruthy());
  });

  it("calls onFallback after max attempts", async () => {
    const onAuth = jest.fn().mockResolvedValue(false);
    const onFallback = jest.fn();
    render(<BiometricPrompt onAuthenticate={onAuth} onFallback={onFallback} maxAttempts={1} />);
    fireEvent.press(screen.getByText("Autenticar"));
    await waitFor(() => expect(onFallback).toHaveBeenCalledTimes(1));
  });
});
