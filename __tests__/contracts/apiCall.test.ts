import { z } from "zod";
import {
  apiCall,
  validateWithSchema,
  getContractViolations,
  clearContractViolations,
} from "@/src/contracts/apiCall";

const testSchema = z.object({
  status: z.boolean(),
  data: z.object({ id: z.number(), name: z.string() }),
});

function createMockClient(responseData: unknown) {
  return {
    request: jest.fn().mockResolvedValue({ data: responseData }),
  } as unknown as import("axios").AxiosInstance;
}

describe("apiCall", () => {
  beforeEach(() => {
    clearContractViolations();
    jest.restoreAllMocks();
  });

  it("returns parsed data when schema matches", async () => {
    const mockData = { status: true, data: { id: 1, name: "Test" } };
    const client = createMockClient(mockData);

    const result = await apiCall(client, {
      schema: testSchema,
      url: "/test",
      method: "GET",
    });

    expect(result).toEqual(mockData);
    expect(getContractViolations()).toHaveLength(0);
  });

  it("returns raw data and records violation when schema fails", async () => {
    const badData = { status: true, data: { id: "NaN", name: 123 } };
    const client = createMockClient(badData);
    jest.spyOn(console, "warn").mockImplementation(() => {});

    const result = await apiCall(client, {
      schema: testSchema,
      url: "/bad",
      method: "POST",
    });

    expect(result).toEqual(badData);
    const violations = getContractViolations();
    expect(violations).toHaveLength(1);
    expect(violations[0].endpoint).toBe("/bad");
    expect(violations[0].method).toBe("POST");
  });

  it("passes data and params to httpClient.request", async () => {
    const mockData = { status: true, data: { id: 1, name: "Test" } };
    const client = createMockClient(mockData);

    await apiCall(client, {
      schema: testSchema,
      url: "/test",
      method: "POST",
      data: { foo: "bar" },
      params: { page: 1 },
    });

    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/test",
        method: "POST",
        data: { foo: "bar" },
        params: { page: 1 },
      }),
    );
  });
});

describe("validateWithSchema", () => {
  beforeEach(() => {
    clearContractViolations();
    jest.restoreAllMocks();
  });

  it("returns parsed data for valid input", () => {
    const data = { status: true, data: { id: 1, name: "Test" } };
    const result = validateWithSchema(testSchema, data, "test-label");
    expect(result).toEqual(data);
    expect(getContractViolations()).toHaveLength(0);
  });

  it("returns raw data and logs violation for invalid input", () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const data = { status: "invalid" };
    const result = validateWithSchema(testSchema, data, "my-label");
    expect(result).toEqual(data);
    const violations = getContractViolations();
    expect(violations).toHaveLength(1);
    expect(violations[0].endpoint).toBe("my-label");
    expect(violations[0].method).toBe("VALIDATE");
  });
});

describe("getContractViolations / clearContractViolations", () => {
  beforeEach(() => clearContractViolations());

  it("returns empty array initially", () => {
    expect(getContractViolations()).toHaveLength(0);
  });

  it("clears violations", () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    validateWithSchema(z.string(), 123, "test");
    expect(getContractViolations().length).toBeGreaterThan(0);
    clearContractViolations();
    expect(getContractViolations()).toHaveLength(0);
  });
});
