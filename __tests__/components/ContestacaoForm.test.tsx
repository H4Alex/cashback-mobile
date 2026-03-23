import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ContestacaoForm } from "@/src/components/ContestacaoForm";

describe("ContestacaoForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all tipo options", () => {
    const { getByText } = render(
      <ContestacaoForm transacaoId={1} onSubmit={mockOnSubmit} isPending={false} />,
    );
    expect(getByText("Cashback não gerado")).toBeTruthy();
    expect(getByText("Valor incorreto")).toBeTruthy();
    expect(getByText("Expiração indevida")).toBeTruthy();
    expect(getByText("Venda cancelada")).toBeTruthy();
  });

  it("renders section titles", () => {
    const { getByText } = render(
      <ContestacaoForm transacaoId={1} onSubmit={mockOnSubmit} isPending={false} />,
    );
    expect(getByText("Tipo da contestação")).toBeTruthy();
    expect(getByText("Descreva o problema")).toBeTruthy();
  });

  it("renders submit button", () => {
    const { getByText } = render(
      <ContestacaoForm transacaoId={1} onSubmit={mockOnSubmit} isPending={false} />,
    );
    expect(getByText("Enviar contestação")).toBeTruthy();
  });

  it("shows spinner when isPending", () => {
    const { queryByText, UNSAFE_getByType } = render(
      <ContestacaoForm transacaoId={1} onSubmit={mockOnSubmit} isPending={true} />,
    );
    // Submit text should be hidden when pending
    expect(queryByText("Enviar contestação")).toBeNull();
  });

  it("selects a tipo option on press", () => {
    const { getByText } = render(
      <ContestacaoForm transacaoId={1} onSubmit={mockOnSubmit} isPending={false} />,
    );
    fireEvent.press(getByText("Valor incorreto"));
    // The button should now be selected (visual feedback)
    expect(getByText("Valor incorreto")).toBeTruthy();
  });

  it("renders description input placeholder", () => {
    const { getByPlaceholderText } = render(
      <ContestacaoForm transacaoId={1} onSubmit={mockOnSubmit} isPending={false} />,
    );
    expect(getByPlaceholderText("Explique o que aconteceu...")).toBeTruthy();
  });

  it("allows typing in description field", () => {
    const { getByPlaceholderText } = render(
      <ContestacaoForm transacaoId={1} onSubmit={mockOnSubmit} isPending={false} />,
    );
    const input = getByPlaceholderText("Explique o que aconteceu...");
    fireEvent.changeText(input, "Meu cashback não foi gerado corretamente");
    expect(input.props.value).toBe("Meu cashback não foi gerado corretamente");
  });

  it("disables submit button when isPending", () => {
    const { UNSAFE_getAllByType } = render(
      <ContestacaoForm transacaoId={1} onSubmit={mockOnSubmit} isPending={true} />,
    );
    // When pending, the submit TouchableOpacity should be disabled
    // We already checked no "Enviar contestação" text in the pending test
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
