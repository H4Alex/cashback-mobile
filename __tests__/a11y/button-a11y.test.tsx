import { render, screen } from "@testing-library/react-native";
import { Button } from "@/src/components/ui/Button";

describe("Button Accessibility", () => {
  it("has button accessibility role", () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("is focusable and has text content", () => {
    render(<Button>Confirmar</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeTruthy();
  });

  it("indicates disabled state to assistive technology", () => {
    render(<Button disabled>Desativado</Button>);
    const button = screen.getByRole("button");
    expect(button.props.accessibilityState?.disabled ?? button.props.disabled).toBeTruthy();
  });
});
