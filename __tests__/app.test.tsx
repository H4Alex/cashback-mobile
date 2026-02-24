import { render, screen } from "@testing-library/react-native";
import HomeScreen from "../app/index";

describe("HomeScreen", () => {
  it("renders the title", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Cashback Mobile")).toBeTruthy();
  });
});
