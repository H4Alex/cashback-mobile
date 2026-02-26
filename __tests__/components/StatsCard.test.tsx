import { render, screen } from "@testing-library/react-native";
import { StatsCard } from "@/src/components/StatsCard";

describe("StatsCard", () => {
  it("renders label and formatted value", () => {
    render(<StatsCard label="Total Cashback" value={5000} variacao={12.5} />);

    expect(screen.getByText("Total Cashback")).toBeTruthy();
    expect(screen.getByText(/5\.000/)).toBeTruthy();
  });

  it("displays positive variation with arrow up", () => {
    render(<StatsCard label="Total" value={1000} variacao={8.5} />);

    expect(screen.getByText(/8\.5%/)).toBeTruthy();
  });

  it("displays negative variation", () => {
    render(<StatsCard label="Total" value={1000} variacao={-3.2} />);

    expect(screen.getByText(/3\.2%/)).toBeTruthy();
  });

  it("handles zero variation", () => {
    render(<StatsCard label="Total" value={1000} variacao={0} />);

    expect(screen.getByText("Total")).toBeTruthy();
  });
});
