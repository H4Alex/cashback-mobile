import { render } from "@testing-library/react-native";
import { Skeleton, SkeletonCard, SkeletonTransaction } from "@/src/components/Skeleton";

describe("Skeleton", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<Skeleton />);
    expect(toJSON()).not.toBeNull();
  });

  it("accepts custom dimensions", () => {
    const { toJSON } = render(<Skeleton width={100} height={20} borderRadius={4} />);
    expect(toJSON()).not.toBeNull();
  });
});

describe("SkeletonCard", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<SkeletonCard />);
    expect(toJSON()).not.toBeNull();
  });
});

describe("SkeletonTransaction", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<SkeletonTransaction />);
    expect(toJSON()).not.toBeNull();
  });
});
