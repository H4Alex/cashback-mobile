import { render, screen } from "@testing-library/react-native";
import { TransactionCard } from "@/src/components/TransactionCard";
import type { CashbackEntry } from "@/src/types";

const makeEntry = (overrides: Partial<CashbackEntry> = {}): CashbackEntry => ({
  id: 1,
  empresa_nome: "Loja Teste",
  empresa_id: 1,
  valor: 45.9,
  status: "confirmado",
  descricao: "Compra cartão",
  created_at: "2025-01-15T10:30:00Z",
  ...overrides,
});

describe("TransactionCard", () => {
  it("renders empresa name and valor", () => {
    render(<TransactionCard entry={makeEntry()} />);
    expect(screen.getByText("Loja Teste")).toBeTruthy();
    expect(screen.getByText(/45,90/)).toBeTruthy();
  });

  it("shows Confirmado badge for confirmado status", () => {
    render(<TransactionCard entry={makeEntry({ status: "confirmado" })} />);
    expect(screen.getByText("Confirmado")).toBeTruthy();
  });

  it("shows Pendente badge for pendente status", () => {
    render(<TransactionCard entry={makeEntry({ status: "pendente" })} />);
    expect(screen.getByText("Pendente")).toBeTruthy();
  });

  it("shows negative sign for expirado status", () => {
    render(<TransactionCard entry={makeEntry({ status: "expirado" })} />);
    expect(screen.getByText("Expirado")).toBeTruthy();
    expect(screen.getByText(/-/)).toBeTruthy();
  });

  it("shows descricao when present", () => {
    render(<TransactionCard entry={makeEntry({ descricao: "Compra teste" })} />);
    expect(screen.getByText("Compra teste")).toBeTruthy();
  });

  it("hides descricao when absent", () => {
    render(<TransactionCard entry={makeEntry({ descricao: undefined })} />);
    expect(screen.queryByText("Compra teste")).toBeNull();
  });
});
