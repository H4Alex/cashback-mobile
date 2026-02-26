/**
 * A11y test helper utilities for React Native Testing Library.
 * Checks accessibility properties on rendered components.
 */

type TestInstance = { props: Record<string, unknown>; type: string; children: unknown[] };

export function expectAccessibleButton(instance: TestInstance) {
  const props = instance.props;
  expect(props.accessibilityRole ?? props.role).toBe("button");
  expect(props.accessibilityLabel ?? props["aria-label"]).toBeTruthy();
}

export function expectAccessibleLabel(instance: TestInstance) {
  const label = instance.props.accessibilityLabel ?? instance.props["aria-label"];
  expect(label).toBeTruthy();
  expect(typeof label).toBe("string");
  expect((label as string).length).toBeGreaterThan(0);
}

export function expectNoEmptyText(instances: TestInstance[]) {
  instances.forEach((instance) => {
    if (instance.type === "Text") {
      const children = instance.props.children;
      if (typeof children === "string") {
        expect(children.trim().length).toBeGreaterThan(0);
      }
    }
  });
}

export function findAllByRole(root: TestInstance, role: string): TestInstance[] {
  const results: TestInstance[] = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.props?.accessibilityRole === role || node.props?.role === role) {
      results.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        if (typeof child !== "string") {
          queue.push(child as TestInstance);
        }
      }
    }
  }
  return results;
}
