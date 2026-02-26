import { type ReactTestInstance } from "react-test-renderer";

/**
 * A11y test helper utilities for React Native Testing Library.
 * Checks accessibility properties on rendered components.
 */

export function expectAccessibleButton(instance: ReactTestInstance) {
  const props = instance.props;
  expect(props.accessibilityRole ?? props.role).toBe("button");
  expect(props.accessibilityLabel ?? props["aria-label"]).toBeTruthy();
}

export function expectAccessibleLabel(instance: ReactTestInstance) {
  const label = instance.props.accessibilityLabel ?? instance.props["aria-label"];
  expect(label).toBeTruthy();
  expect(typeof label).toBe("string");
  expect(label.length).toBeGreaterThan(0);
}

export function expectNoEmptyText(instances: ReactTestInstance[]) {
  instances.forEach((instance) => {
    if (instance.type === "Text") {
      const children = instance.props.children;
      if (typeof children === "string") {
        expect(children.trim().length).toBeGreaterThan(0);
      }
    }
  });
}

export function findAllByRole(
  root: ReactTestInstance,
  role: string,
): ReactTestInstance[] {
  const results: ReactTestInstance[] = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (
      node.props?.accessibilityRole === role ||
      node.props?.role === role
    ) {
      results.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        if (typeof child !== "string") {
          queue.push(child);
        }
      }
    }
  }
  return results;
}
