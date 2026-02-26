import { render, screen, fireEvent } from "@testing-library/react-native";
import { FilterChips } from "@/src/components/FilterChips";

const options = [
  { value: "all", label: "Todos" },
  { value: "creditado", label: "Creditado" },
  { value: "pendente", label: "Pendente" },
];

describe("FilterChips", () => {
  it("renders all options", () => {
    render(<FilterChips options={options} onSelect={jest.fn()} />);
    expect(screen.getByText("Todos")).toBeTruthy();
    expect(screen.getByText("Creditado")).toBeTruthy();
    expect(screen.getByText("Pendente")).toBeTruthy();
  });

  it("calls onSelect with value when chip is pressed", () => {
    const onSelect = jest.fn();
    render(<FilterChips options={options} onSelect={onSelect} />);
    fireEvent.press(screen.getByText("Creditado"));
    expect(onSelect).toHaveBeenCalledWith("creditado");
  });

  it("calls onSelect with undefined when active chip is pressed (deselect)", () => {
    const onSelect = jest.fn();
    render(<FilterChips options={options} selected="creditado" onSelect={onSelect} />);
    fireEvent.press(screen.getByText("Creditado"));
    expect(onSelect).toHaveBeenCalledWith(undefined);
  });
});
