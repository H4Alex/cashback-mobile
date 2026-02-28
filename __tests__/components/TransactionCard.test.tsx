import { render, screen } from "@testing-library/react-native";
import { TransactionCard } from "@/src/components/TransactionCard";
import type { ExtratoEntry } from "@/src/types";

const makeEntry = (overrides: Partial<ExtratoEntry> = {}): ExtratoEntry => ({
  id: 1,
  tipo: "compra",
  valor_compra: 200,
  valor_cashback: 45.9,
  status_cashback: "confirmado",
  data_expiracao: null,
  created_at: "2025-01-15T10:30:00Z",
  empresa: { id: 1, nome_fantasia: "Loja Teste", logo_url: null },
  campanha: { id: 1, nome: "Compra cartão" },
  ...overrides,
});

describe("TransactionCard", () => {
  it("renders empresa name and valor", () => {
    render(<TransactionCard entry={makeEntry()} />);
    expect(screen.getByText("Loja Teste")).toBeTruthy();
    expect(screen.getByText(/45,90/)).toBeTruthy();
  });

  it("shows Confirmado badge for confirmado status", () => {
    render(<TransactionCard entry={makeEntry({ status_cashback: "confirmado" })} />);
    expect(screen.getByText("Confirmado")).toBeTruthy();
  });

  it("shows Pendente badge for pendente status", () => {
    render(<TransactionCard entry={makeEntry({ status_cashback: "pendente" })} />);
    expect(screen.getByText("Pendente")).toBeTruthy();
  });

  it("shows negative sign for expirado status", () => {
    render(<TransactionCard entry={makeEntry({ status_cashback: "expirado" })} />);
    expect(screen.getByText("Expirado")).toBeTruthy();
    expect(screen.getByText(/-/)).toBeTruthy();
  });

  it("shows campanha name when present", () => {
    render(<TransactionCard entry={makeEntry({ campanha: { id: 1, nome: "Compra teste" } })} />);
    expect(screen.getByText("Compra teste")).toBeTruthy();
  });

  it("hides campanha name when absent", () => {
    render(<TransactionCard entry={makeEntry({ campanha: undefined })} />);
    expect(screen.queryByText("Compra teste")).toBeNull();
  });
});
