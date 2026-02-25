import { render, screen } from "@testing-library/react-native";
import IndexScreen from "../app/index";

jest.mock("@cashback/shared", () => ({
  useAuthStore: (selector: (state: Record<string, unknown>) => unknown) => {
    const state = { token: null, user: null };
    return selector(state);
  },
}));

jest.mock("expo-router", () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require("react-native");
    return <Text testID="redirect">{href}</Text>;
  },
}));

describe("IndexScreen", () => {
  it("redirects to login when no token", () => {
    render(<IndexScreen />);
    expect(screen.getByTestId("redirect").props.children).toBe(
      "/(auth)/login"
    );
  });
});
