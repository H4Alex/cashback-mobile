import { render, screen, fireEvent } from "@testing-library/react-native";
import { Input } from "@/src/components/ui/Input";

describe("Input", () => {
  it("renders label when provided", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeTruthy();
  });

  it("shows error message", () => {
    render(<Input error="Campo obrigatório" />);
    expect(screen.getByText("Campo obrigatório")).toBeTruthy();
  });

  it("applies CPF mask", () => {
    const onChangeText = jest.fn();
    render(<Input type="cpf" label="CPF" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByLabelText("CPF"), "12345678901");
    expect(onChangeText).toHaveBeenCalledWith("123.456.789-01");
  });

  it("applies CNPJ mask", () => {
    const onChangeText = jest.fn();
    render(<Input type="cnpj" label="CNPJ" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByLabelText("CNPJ"), "12345678000199");
    expect(onChangeText).toHaveBeenCalledWith("12.345.678/0001-99");
  });

  it("applies phone mask for 11 digits", () => {
    const onChangeText = jest.fn();
    render(<Input type="phone" label="Telefone" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByLabelText("Telefone"), "11999887766");
    expect(onChangeText).toHaveBeenCalledWith("(11) 99988-7766");
  });

  it("applies currency mask", () => {
    const onChangeText = jest.fn();
    render(<Input type="currency" label="Valor" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByLabelText("Valor"), "12345");
    expect(onChangeText).toHaveBeenCalledWith("R$ 123,45");
  });

  it("applies CEP mask", () => {
    const onChangeText = jest.fn();
    render(<Input type="cep" label="CEP" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByLabelText("CEP"), "12345678");
    expect(onChangeText).toHaveBeenCalledWith("12345-678");
  });

  it("shows/hides password toggle for password type", () => {
    render(<Input type="password" label="Senha" />);
    expect(screen.getByText("Mostrar")).toBeTruthy();
    fireEvent.press(screen.getByText("Mostrar"));
    expect(screen.getByText("Ocultar")).toBeTruthy();
  });
});
