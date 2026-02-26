import { render, screen, fireEvent } from "@testing-library/react-native";
import { ErrorScreen, getErrorType } from "@/src/components/ErrorScreen";

describe("ErrorScreen", () => {
  it("renders unknown error by default", () => {
    render(<ErrorScreen />);
    expect(screen.getByText("Erro inesperado")).toBeTruthy();
    expect(screen.getByText("Algo deu errado. Tente novamente.")).toBeTruthy();
  });

  it("renders network error", () => {
    render(<ErrorScreen type="network" />);
    expect(screen.getByText("Sem conexão")).toBeTruthy();
  });

  it("renders server error", () => {
    render(<ErrorScreen type="server" />);
    expect(screen.getByText("Erro no servidor")).toBeTruthy();
  });

  it("renders timeout error", () => {
    render(<ErrorScreen type="timeout" />);
    expect(screen.getByText("Conexão lenta")).toBeTruthy();
  });

  it("renders session error", () => {
    render(<ErrorScreen type="session" />);
    expect(screen.getByText("Sessão expirada")).toBeTruthy();
  });

  it("renders custom message", () => {
    render(<ErrorScreen type="server" message="Custom message" />);
    expect(screen.getByText("Custom message")).toBeTruthy();
  });

  it("shows retry button when onRetry provided", () => {
    const onRetry = jest.fn();
    render(<ErrorScreen onRetry={onRetry} />);
    fireEvent.press(screen.getByText("Tentar novamente"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("hides retry button when no onRetry", () => {
    render(<ErrorScreen />);
    expect(screen.queryByText("Tentar novamente")).toBeNull();
  });
});

describe("getErrorType", () => {
  it("returns timeout for ECONNABORTED code", () => {
    expect(getErrorType({ code: "ECONNABORTED" })).toBe("timeout");
  });

  it("returns timeout for timeout message", () => {
    expect(getErrorType({ message: "Request timeout" })).toBe("timeout");
  });

  it("returns network for Network Error message", () => {
    expect(getErrorType({ message: "Network Error" })).toBe("network");
  });

  it("returns network for ERR_NETWORK code", () => {
    expect(getErrorType({ code: "ERR_NETWORK" })).toBe("network");
  });

  it("returns session for 401 status", () => {
    expect(getErrorType({ status: 401 })).toBe("session");
  });

  it("returns server for 500+ status", () => {
    expect(getErrorType({ status: 500 })).toBe("server");
    expect(getErrorType({ status: 503 })).toBe("server");
  });

  it("returns unknown for null/undefined", () => {
    expect(getErrorType(null)).toBe("unknown");
    expect(getErrorType(undefined)).toBe("unknown");
  });

  it("returns unknown for unrecognized error shape", () => {
    expect(getErrorType({ status: 404 })).toBe("unknown");
  });
});
