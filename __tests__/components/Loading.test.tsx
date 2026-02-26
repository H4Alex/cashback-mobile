import { render } from "@testing-library/react-native";
import { Loading } from "@/src/components/ui/Loading";

describe("Loading", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<Loading />);
    expect(toJSON()).not.toBeNull();
  });
});
