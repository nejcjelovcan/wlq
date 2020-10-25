import {
  ExistsStoreError,
  getErrorMessage,
  getErrorStatusCode,
  NotFoundStoreError,
  StateStoreError,
  StoreError,
  ValidationError
} from "../";

describe("getErrorMessage", () => {
  it("returns error message of a StoreError", () => {
    expect(getErrorMessage(new StoreError("Store error"))).toBe("Store error");
  });
  it("returns error message of a NotFoundStoreError", () => {
    expect(getErrorMessage(new NotFoundStoreError("Store error"))).toBe(
      "Store error"
    );
  });
  it("returns error message of a ValidationError", () => {
    expect(getErrorMessage(new ValidationError(["Validation error"]))).toBe(
      "Validation error"
    );
  });
  it("returns Internal error for other errors", () => {
    expect(getErrorMessage(new Error("Test error"))).toBe("Internal error");
  });
});

describe("getErrorStatusCode", () => {
  it("returns 404 for NotFoundStoreError", () => {
    expect(getErrorStatusCode(new NotFoundStoreError("Not found"))).toBe(404);
  });
  it("returns 409 for ExistsStoreError", () => {
    expect(getErrorStatusCode(new ExistsStoreError("Exists"))).toBe(409);
  });
  it("returns 412 for StateStoreError", () => {
    expect(getErrorStatusCode(new StateStoreError("State error"))).toBe(412);
  });
  it("returns 400 for ValidationError", () => {
    expect(getErrorStatusCode(new ValidationError(["Invalid parameter"]))).toBe(
      400
    );
    expect(getErrorStatusCode(new ValidationError([]))).toBe(400);
  });
  it("returns 500 for any other error", () => {
    expect(getErrorStatusCode(new Error("Error"))).toBe(500);
    expect(getErrorStatusCode(new StoreError("Store error"))).toBe(500);
  });
});
