import { render, screen, fireEvent } from "@testing-library/react-native";
import { CPFSearchInput } from "@/src/components/CPFSearchInput";

describe("CPFSearchInput", () => {
  const defaultProps = {
    cpf: "",
    onChangeCpf: jest.fn(),
    isSearching: false,
    results: undefined as any[] | undefined,
    selectedCliente: null,
    onSelectCliente: jest.fn(),
  };

  it("renders label and input", () => {
    render(<CPFSearchInput {...defaultProps} />);
    expect(screen.getByText("CPF do cliente")).toBeTruthy();
    expect(screen.getByPlaceholderText("000.000.000-00")).toBeTruthy();
  });

  it("calls onChangeCpf with masked value", () => {
    const onChangeCpf = jest.fn();
    render(<CPFSearchInput {...defaultProps} onChangeCpf={onChangeCpf} />);
    fireEvent.changeText(screen.getByPlaceholderText("000.000.000-00"), "12345678901");
    expect(onChangeCpf).toHaveBeenCalledWith("123.456.789-01");
  });

  it("shows selected cliente when provided", () => {
    render(
      <CPFSearchInput
        {...defaultProps}
        selectedCliente={{ id: 1, nome: "João Silva", email: "joao@test.com" }}
      />,
    );
    expect(screen.getByText("João Silva")).toBeTruthy();
    expect(screen.getByText("joao@test.com")).toBeTruthy();
  });

  it("shows search results when available", () => {
    render(
      <CPFSearchInput
        {...defaultProps}
        results={[{ id: 1, nome: "Maria", email: "maria@test.com" }]}
      />,
    );
    expect(screen.getByText("Maria")).toBeTruthy();
    expect(screen.getByText("maria@test.com")).toBeTruthy();
  });

  it("shows no results message for complete CPF with empty results", () => {
    render(
      <CPFSearchInput
        {...defaultProps}
        cpf="123.456.789-01"
        results={[]}
      />,
    );
    expect(screen.getByText(/Nenhum cliente encontrado/)).toBeTruthy();
  });
});
