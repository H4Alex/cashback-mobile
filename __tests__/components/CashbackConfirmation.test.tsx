import { render, screen, fireEvent } from "@testing-library/react-native";
import { CashbackConfirmation, makeConfirmationItems } from "@/src/components/CashbackConfirmation";

const items = [
  { label: "Valor", value: "R$ 50,00", highlight: true },
  { label: "Empresa", value: "Loja Teste" },
];

describe("CashbackConfirmation", () => {
  it("renders title and items", () => {
    render(
      <CashbackConfirmation
        title="Confirmar Cashback"
        items={items}
        confirmLabel="Confirmar"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isPending={false}
      />,
    );
    expect(screen.getByText("Confirmar Cashback")).toBeTruthy();
    expect(screen.getByText("Valor")).toBeTruthy();
    expect(screen.getByText("R$ 50,00")).toBeTruthy();
    expect(screen.getByText("Empresa")).toBeTruthy();
    expect(screen.getByText("Loja Teste")).toBeTruthy();
  });

  it("calls onConfirm when confirm button is pressed", () => {
    const onConfirm = jest.fn();
    render(
      <CashbackConfirmation
        title="Confirmar"
        items={items}
        confirmLabel="OK"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
        isPending={false}
      />,
    );
    fireEvent.press(screen.getByText("OK"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is pressed", () => {
    const onCancel = jest.fn();
    render(
      <CashbackConfirmation
        title="Confirmar"
        items={items}
        confirmLabel="OK"
        onConfirm={jest.fn()}
        onCancel={onCancel}
        isPending={false}
      />,
    );
    fireEvent.press(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when isPending", () => {
    const onConfirm = jest.fn();
    render(
      <CashbackConfirmation
        title="Confirmar"
        items={items}
        confirmLabel="OK"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
        isPending
      />,
    );
    expect(screen.queryByText("OK")).toBeNull(); // Shows spinner instead
  });
});

describe("makeConfirmationItems", () => {
  it("formats items with currency values", () => {
    const result = makeConfirmationItems([
      { label: "Valor", value: 50, highlight: true },
      { label: "Taxa", value: 2.5 },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Valor");
    expect(result[0].value).toContain("50");
    expect(result[0].highlight).toBe(true);
    expect(result[1].label).toBe("Taxa");
  });
});
