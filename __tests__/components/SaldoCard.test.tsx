import { render, screen, fireEvent } from "@testing-library/react-native";
import { SaldoCard } from "@/src/components/SaldoCard";

const baseSaldo = {
  disponivel: 150.5,
  pendente: 30.0,
  total: 500.75,
  proximo_a_expirar: null as { valor: number; quantidade: number } | null,
};

describe("SaldoCard", () => {
  it("renders saldo disponivel formatted", () => {
    render(<SaldoCard saldo={baseSaldo} />);
    expect(screen.getByText(/150,50/)).toBeTruthy();
  });

  it("renders pendente and total values", () => {
    render(<SaldoCard saldo={baseSaldo} />);
    expect(screen.getByText(/30,00/)).toBeTruthy();
    expect(screen.getByText(/500,75/)).toBeTruthy();
  });

  it("shows expiry warning when proximo_a_expirar has value", () => {
    const saldo = {
      ...baseSaldo,
      proximo_a_expirar: { valor: 25.0, quantidade: 2 },
    };
    render(<SaldoCard saldo={saldo} />);
    expect(screen.getByText(/25,00/)).toBeTruthy();
    expect(screen.getByText(/expirando em 7 dias/)).toBeTruthy();
  });

  it("hides expiry warning when valor is 0", () => {
    const saldo = {
      ...baseSaldo,
      proximo_a_expirar: { valor: 0, quantidade: 0 },
    };
    render(<SaldoCard saldo={saldo} />);
    expect(screen.queryByText(/expirando/)).toBeNull();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<SaldoCard saldo={baseSaldo} onPress={onPress} />);
    fireEvent.press(screen.getByText(/150,50/));
    expect(onPress).toHaveBeenCalled();
  });
});
