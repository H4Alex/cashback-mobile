import { render, screen } from "@testing-library/react-native";
import { StatusBadge } from "@/src/components/StatusBadge";

describe("StatusBadge", () => {
  it("renders Pendente label", () => {
    render(<StatusBadge status="pendente" />);
    expect(screen.getByText("Pendente")).toBeTruthy();
  });

  it("renders Aprovada label", () => {
    render(<StatusBadge status="aprovada" />);
    expect(screen.getByText("Aprovada")).toBeTruthy();
  });

  it("renders Rejeitada label", () => {
    render(<StatusBadge status="rejeitada" />);
    expect(screen.getByText("Rejeitada")).toBeTruthy();
  });
});
