import { render, screen } from "@testing-library/react-native";
import { DashboardChart, SparklineChart } from "@/src/components/DashboardChart";

const mockData = [
  { label: "Seg", gerado: 100, utilizado: 50 },
  { label: "Ter", gerado: 200, utilizado: 80 },
  { label: "Qua", gerado: 150, utilizado: 120 },
];

describe("DashboardChart", () => {
  it("renders chart with data", () => {
    const { toJSON } = render(<DashboardChart data={mockData} />);
    expect(toJSON()).not.toBeNull();
  });

  it("renders loading skeleton when isLoading", () => {
    const { toJSON } = render(<DashboardChart data={[]} isLoading />);
    expect(toJSON()).not.toBeNull();
  });

  it("renders empty message when no data", () => {
    render(<DashboardChart data={[]} />);
    expect(screen.getByText("Sem dados para exibir")).toBeTruthy();
  });

  it("renders legend labels", () => {
    render(<DashboardChart data={mockData} />);
    expect(screen.getByText("Gerado")).toBeTruthy();
    expect(screen.getByText("Utilizado")).toBeTruthy();
  });

  it("renders title", () => {
    render(<DashboardChart data={mockData} />);
    expect(screen.getByText("Evolução 7 dias")).toBeTruthy();
  });
});

describe("SparklineChart", () => {
  it("renders with valid values", () => {
    const { toJSON } = render(<SparklineChart values={[10, 20, 15, 25]} />);
    expect(toJSON()).not.toBeNull();
  });

  it("returns null with less than 2 values", () => {
    const { toJSON } = render(<SparklineChart values={[10]} />);
    expect(toJSON()).toBeNull();
  });

  it("returns null with empty array", () => {
    const { toJSON } = render(<SparklineChart values={[]} />);
    expect(toJSON()).toBeNull();
  });
});
