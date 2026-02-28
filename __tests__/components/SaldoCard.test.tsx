import { render, screen, fireEvent } from "@testing-library/react-native";
import { SaldoCard } from "@/src/components/SaldoCard";
import type { CashbackSaldo } from "@/src/types";

const baseSaldo: CashbackSaldo = {
  saldo_total: 150.5,
  por_empresa: [],
  proximo_a_expirar: { valor: 0, quantidade: 0 },
};

describe("SaldoCard", () => {
  it("renders saldo_total formatted", () => {
    render(<SaldoCard saldo={baseSaldo} />);
    expect(screen.getByText(/150,50/)).toBeTruthy();
  });

  it("shows expiry warning when proximo_a_expirar has value", () => {
    const saldo: CashbackSaldo = {
      ...baseSaldo,
      proximo_a_expirar: { valor: 25.0, quantidade: 2 },
    };
    render(<SaldoCard saldo={saldo} />);
    expect(screen.getByText(/25,00/)).toBeTruthy();
    expect(screen.getByText(/expirando em 7 dias/)).toBeTruthy();
  });

  it("hides expiry warning when valor is 0", () => {
    render(<SaldoCard saldo={baseSaldo} />);
    expect(screen.queryByText(/expirando/)).toBeNull();
  });

  it("renders per-company breakdown", () => {
    const saldo: CashbackSaldo = {
      ...baseSaldo,
      por_empresa: [
        { empresa_id: 1, nome_fantasia: "Loja A", logo_url: null, saldo: "80.50" },
        { empresa_id: 2, nome_fantasia: "Loja B", logo_url: null, saldo: "70.00" },
      ],
    };
    render(<SaldoCard saldo={saldo} />);
    expect(screen.getByText("Loja A")).toBeTruthy();
    expect(screen.getByText("Loja B")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<SaldoCard saldo={baseSaldo} onPress={onPress} />);
    fireEvent.press(screen.getByText(/150,50/));
    expect(onPress).toHaveBeenCalled();
  });
});
