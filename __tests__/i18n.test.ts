import { t, setLocale, getLocale } from "@/src/i18n";

describe("i18n", () => {
  afterEach(() => {
    setLocale("pt-BR");
  });

  it("returns pt-BR translations by default", () => {
    expect(getLocale()).toBe("pt-BR");
    expect(t("common.loading")).toBe("Carregando...");
  });

  it("switches to English", () => {
    setLocale("en");
    expect(t("common.loading")).toBe("Loading...");
  });

  it("returns key for missing translations", () => {
    expect(t("nonexistent.key" as never)).toBe("nonexistent.key");
  });

  it("translates auth section", () => {
    expect(t("auth.login")).toBe("Entrar");
    setLocale("en");
    expect(t("auth.login")).toBe("Sign in");
  });
});
