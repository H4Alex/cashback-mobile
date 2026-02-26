import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { PullToRefresh } from "@/src/components/PullToRefresh";

describe("PullToRefresh", () => {
  it("renders children", () => {
    render(
      <PullToRefresh refreshing={false} onRefresh={jest.fn()}>
        <Text>Content</Text>
      </PullToRefresh>,
    );
    expect(screen.getByText("Content")).toBeTruthy();
  });

  it("renders without crashing when refreshing", () => {
    const { toJSON } = render(
      <PullToRefresh refreshing onRefresh={jest.fn()}>
        <Text>Refreshing</Text>
      </PullToRefresh>,
    );
    expect(toJSON()).not.toBeNull();
  });
});
