import { monetarioSchema } from "../../src/contracts/schemas/common.schemas";

describe("monetarioSchema", () => {
  it("aceita number direto", () => {
    const r = monetarioSchema.safeParse(100.5);
    expect(r.success).toBe(true);
    if (r.success) expect(typeof r.data).toBe("number");
  });

  it("aceita string numérica e transforma para number", () => {
    const r = monetarioSchema.safeParse("100.50");
    expect(r.success).toBe(true);
    if (r.success) {
      expect(typeof r.data).toBe("number");
      expect(r.data).toBe(100.5);
    }
  });

  it("aceita zero", () => {
    expect(monetarioSchema.safeParse(0).success).toBe(true);
  });

  it("aceita número negativo", () => {
    const r = monetarioSchema.safeParse(-50.25);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe(-50.25);
  });

  it("rejeita string não numérica", () => {
    expect(monetarioSchema.safeParse("abc").success).toBe(false);
  });

  it("rejeita Infinity", () => {
    expect(monetarioSchema.safeParse(Infinity).success).toBe(false);
  });

  it("rejeita NaN", () => {
    expect(monetarioSchema.safeParse(NaN).success).toBe(false);
  });
});
