import { render, screen, fireEvent } from "@testing-library/react-native";
import { PermissionRequest } from "@/src/components/PermissionRequest";

describe("PermissionRequest", () => {
  it("renders icon, title, description and button", () => {
    render(
      <PermissionRequest
        icon="📷"
        title="Acesso à câmera"
        description="Precisamos da câmera para ler QR Codes"
        buttonLabel="Permitir"
        onRequest={jest.fn()}
      />,
    );
    expect(screen.getByText("📷")).toBeTruthy();
    expect(screen.getByText("Acesso à câmera")).toBeTruthy();
    expect(screen.getByText(/câmera para ler QR Codes/)).toBeTruthy();
    expect(screen.getByText("Permitir")).toBeTruthy();
  });

  it("calls onRequest when button is pressed", () => {
    const onRequest = jest.fn();
    render(
      <PermissionRequest
        icon="📷"
        title="Câmera"
        description="Desc"
        buttonLabel="Permitir"
        onRequest={onRequest}
      />,
    );
    fireEvent.press(screen.getByText("Permitir"));
    expect(onRequest).toHaveBeenCalledTimes(1);
  });
});
