import {
  formatCurrency,
  formatCPF,
  formatPhone,
  formatDate,
} from "@/src/utils/formatters";

describe("formatters", () => {
  it("formats currency in BRL", () => {
    expect(formatCurrency(1234.56)).toContain("1.234,56");
  });

  it("formats CPF", () => {
    expect(formatCPF("12345678901")).toBe("123.456.789-01");
  });

  it("formats mobile phone", () => {
    expect(formatPhone("11999887766")).toBe("(11) 99988-7766");
  });

  it("formats landline phone", () => {
    expect(formatPhone("1133445566")).toBe("(11) 3344-5566");
  });

  it("formats date", () => {
    const result = formatDate("2026-03-15T10:30:00Z");
    expect(result).toContain("15");
    expect(result).toContain("03");
    expect(result).toContain("2026");
  });
});
