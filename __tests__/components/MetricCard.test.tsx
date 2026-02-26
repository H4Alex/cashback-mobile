import { render, screen } from "@testing-library/react-native";
import { MetricCard } from "@/src/components/MetricCard";

describe("MetricCard", () => {
  it("renders label and formatted currency value", () => {
    render(<MetricCard label="Saldo Total" value={1234.56} />);

    expect(screen.getByText("Saldo Total")).toBeTruthy();
    expect(screen.getByText(/1\.234,56/)).toBeTruthy();
  });

  it("renders non-currency value when isCurrency is false", () => {
    render(<MetricCard label="Clientes Ativos" value={42} isCurrency={false} />);

    expect(screen.getByText("Clientes Ativos")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("renders zero value", () => {
    render(<MetricCard label="Pendente" value={0} />);

    expect(screen.getByText("Pendente")).toBeTruthy();
  });
});
