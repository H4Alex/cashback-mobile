import { render, screen } from "@testing-library/react-native";
import { CashbackTimeline } from "@/src/components/CashbackTimeline";
import type { CashbackEntry } from "@/src/types";

const entries: CashbackEntry[] = [
  {
    id: "1",
    empresa_nome: "Loja A",
    empresa_id: "e1",
    valor: 20.5,
    status: "creditado",
    descricao: "Compra online",
    created_at: "2025-01-10T10:00:00Z",
  },
  {
    id: "2",
    empresa_nome: "Loja B",
    empresa_id: "e2",
    valor: 15.0,
    status: "pendente",
    created_at: "2025-01-09T08:00:00Z",
  },
  {
    id: "3",
    empresa_nome: "Loja C",
    empresa_id: "e3",
    valor: 5.0,
    status: "expirado",
    created_at: "2024-12-25T12:00:00Z",
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
    expect(screen.getByText("Creditado")).toBeTruthy();
    expect(screen.getByText("Pendente")).toBeTruthy();
    expect(screen.getByText("Expirado")).toBeTruthy();
  });

  it("renders descricao when present", () => {
    render(<CashbackTimeline entries={entries} />);
    expect(screen.getByText("Compra online")).toBeTruthy();
  });
});
