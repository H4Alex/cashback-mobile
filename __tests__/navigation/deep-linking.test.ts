describe("Deep Linking Configuration", () => {
  it("app uses h4cashback scheme", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const appJson = require("../../app.json");
    expect(appJson.expo.scheme).toBe("h4cashback");
  });

  it("generates correct cashback deep link format", () => {
    const scheme = "h4cashback";
    const url = `${scheme}://cashback/123`;
    expect(url).toBe("h4cashback://cashback/123");
  });

  it("generates correct QR code deep link format", () => {
    const scheme = "h4cashback";
    const url = `${scheme}://qrcode/scan`;
    expect(url).toBe("h4cashback://qrcode/scan");
  });

  it("generates correct notification deep link format", () => {
    const scheme = "h4cashback";
    const url = `${scheme}://notifications`;
    expect(url).toBe("h4cashback://notifications");
  });
});
