import { render, screen, fireEvent } from "@testing-library/react-native";
import { EmptyState } from "@/src/components/EmptyState";

describe("EmptyState", () => {
  it("renders title and message", () => {
    render(<EmptyState title="Nenhum item" message="Não há dados para exibir" />);
    expect(screen.getByText("Nenhum item")).toBeTruthy();
    expect(screen.getByText("Não há dados para exibir")).toBeTruthy();
  });

  it("renders action button when actionLabel and onAction provided", () => {
    const onAction = jest.fn();
    render(
      <EmptyState title="Vazio" message="Nada aqui" actionLabel="Recarregar" onAction={onAction} />,
    );
    const button = screen.getByText("Recarregar");
    expect(button).toBeTruthy();
    fireEvent.press(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("hides action button when no actionLabel", () => {
    render(<EmptyState title="Vazio" message="Nada aqui" />);
    expect(screen.queryByText("Recarregar")).toBeNull();
  });
});
