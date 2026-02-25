import { loginSchema, registerSchema } from "@/src/schemas";

describe("loginSchema", () => {
  it("validates valid login data", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "123",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const validData = {
    nome: "João Silva",
    email: "joao@example.com",
    cpf: "12345678901",
    telefone: "11999887766",
    password: "12345678",
    confirmPassword: "12345678",
  };

  it("validates valid registration data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid CPF length", () => {
    const result = registerSchema.safeParse({
      ...validData,
      cpf: "123",
    });
    expect(result.success).toBe(false);
  });
});
