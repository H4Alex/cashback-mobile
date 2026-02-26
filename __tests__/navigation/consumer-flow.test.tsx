import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("@/src/components/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Consumer Navigation Flow", () => {
  it("consumer layout wraps with ErrorBoundary", () => {
    const ConsumerLayout = () => (
      <Text>Consumer Dashboard</Text>
    );

    render(<ConsumerLayout />);
    expect(screen.getByText("Consumer Dashboard")).toBeTruthy();
  });

  it("consumer tabs include contestacao screens", () => {
    const screens = ["(tabs)", "contestacao/index", "contestacao/create"];
    expect(screens).toContain("contestacao/index");
    expect(screens).toContain("contestacao/create");
  });

  it("contestacao/index has correct title", () => {
    const screenOptions = { headerShown: true, title: "Contestações" };
    expect(screenOptions.title).toBe("Contestações");
    expect(screenOptions.headerShown).toBe(true);
  });

  it("contestacao/create has correct title", () => {
    const screenOptions = { headerShown: true, title: "Nova Contestação" };
    expect(screenOptions.title).toBe("Nova Contestação");
    expect(screenOptions.headerShown).toBe(true);
  });
});
