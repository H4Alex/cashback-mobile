import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";

describe("Card", () => {
  it("renders children", () => {
    render(
      <Card>
        <Text>Card Content</Text>
      </Card>,
    );
    expect(screen.getByText("Card Content")).toBeTruthy();
  });
});

describe("CardHeader", () => {
  it("renders title", () => {
    render(<CardHeader title="Header Title" />);
    expect(screen.getByText("Header Title")).toBeTruthy();
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(
      <CardContent>
        <Text>Inner Content</Text>
      </CardContent>,
    );
    expect(screen.getByText("Inner Content")).toBeTruthy();
  });
});
