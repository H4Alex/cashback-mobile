import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { AnimatedCardEntry } from "@/src/components/AnimatedCardEntry";

describe("AnimatedCardEntry", () => {
  it("renders children", () => {
    const { getByText } = render(
      <AnimatedCardEntry>
        <Text>Card Content</Text>
      </AnimatedCardEntry>,
    );
    expect(getByText("Card Content")).toBeTruthy();
  });

  it("renders with custom index and delay", () => {
    const { getByText } = render(
      <AnimatedCardEntry index={2} delay={100}>
        <Text>Staggered</Text>
      </AnimatedCardEntry>,
    );
    expect(getByText("Staggered")).toBeTruthy();
  });

  it("renders with custom style prop", () => {
    const { getByText } = render(
      <AnimatedCardEntry style={{ marginTop: 10 }}>
        <Text>Styled</Text>
      </AnimatedCardEntry>,
    );
    expect(getByText("Styled")).toBeTruthy();
  });

  it("renders with default index 0 and delay 50", () => {
    const { getByText } = render(
      <AnimatedCardEntry>
        <Text>Default</Text>
      </AnimatedCardEntry>,
    );
    expect(getByText("Default")).toBeTruthy();
  });
});
