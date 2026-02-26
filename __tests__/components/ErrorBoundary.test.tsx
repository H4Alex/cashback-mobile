import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";

function ProblemChild(): React.JSX.Element {
  throw new Error("Test error");
}

function GoodChild() {
  return <Text>Working fine</Text>;
}

// Suppress console.error for ErrorBoundary tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Working fine")).toBeTruthy();
  });

  it("renders error UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Algo deu errado")).toBeTruthy();
    expect(screen.getByText(/Ocorreu um erro inesperado/)).toBeTruthy();
  });

  it("renders retry button", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Tentar novamente")).toBeTruthy();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<Text>Custom Fallback</Text>}>
        <ProblemChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Custom Fallback")).toBeTruthy();
  });
});
