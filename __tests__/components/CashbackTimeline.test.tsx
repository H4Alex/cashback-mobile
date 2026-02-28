import { render, screen } from "@testing-library/react-native";
import { CashbackTimeline } from "@/src/components/CashbackTimeline";
import type { ExtratoEntry } from "@/src/types";

const entries: ExtratoEntry[] = [
  {
    id: 1,
    tipo: "compra",
    valor_compra: 100,
    valor_cashback: 20.5,
    status_cashback: "confirmado",
    data_expiracao: null,
    created_at: "2025-01-10T10:00:00Z",
    empresa: { id: 1, nome_fantasia: "Loja A", logo_url: null },
    campanha: { id: 1, nome: "Compra online" },
  },
  {
    id: 2,
    tipo: "compra",
    valor_compra: 75,
    valor_cashback: 15.0,
    status_cashback: "pendente",
    data_expiracao: null,
    created_at: "2025-01-09T08:00:00Z",
    empresa: { id: 2, nome_fantasia: "Loja B", logo_url: null },
  },
  {
    id: 3,
    tipo: "compra",
    valor_compra: 50,
    valor_cashback: 5.0,
    status_cashback: "expirado",
    data_expiracao: null,
    created_at: "2024-12-25T12:00:00Z",
    empresa: { id: 3, nome_fantasia: "Loja C", logo_url: null },
  },
];

describe("CashbackTimeline", () => {
  it("renders all entries", () => {
    render(<CashbackTimeline entries={entries} />);
    expect(screen.getByText("Loja A")).toBeTruthy();
    expect(screen.getByText("Loja B")).toBeTruthy();
    expect(screen.getByText("Loja C")).toBeTruthy();
  });

  it("renders formatted values", () => {
    render(<CashbackTimeline entries={entries} />);
    expect(screen.getByText(/20,50/)).toBeTruthy();
    expect(screen.getByText(/15,00/)).toBeTruthy();
  });

  it("renders status labels", () => {
    render(<CashbackTimeline entries={entries} />);
    expect(screen.getByText("Confirmado")).toBeTruthy();
    expect(screen.getByText("Pendente")).toBeTruthy();
    expect(screen.getByText("Expirado")).toBeTruthy();
  });

  it("renders descricao when present", () => {
    render(<CashbackTimeline entries={entries} />);
    expect(screen.getByText("Compra online")).toBeTruthy();
  });
});
