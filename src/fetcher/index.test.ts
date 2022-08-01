import {
  assertEquals,
  assertObjectMatch,
  assertThrows,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { Fetcher, Method } from "/src/fetcher/index.ts";
import { describe, it } from "https://deno.land/std@0.150.0/testing/bdd.ts";
import {
  assertSpyCallArgs,
  spy,
} from "https://deno.land/std@0.150.0/testing/mock.ts";

type Fetch = typeof fetch;

const getNoopFetchMock = () => spy((() => {}) as unknown as Fetch);

it("should assign retrieved fetch and default values to new object", function () {
  const fetchSpy = getNoopFetchMock();
  const fetcher = new Fetcher(fetchSpy);
  assertObjectMatch(fetcher, {
    fetch: fetchSpy,
    path: undefined,
    method: "GET",
  });
});

describe("withPath", function () {
  it("should modify path", function () {
    const builder = new Fetcher(getNoopFetchMock());
    builder.withPath("/world");

    assertEquals((builder as any).path, "/world");
  });

  itShouldReturnInstance("withPath", "/hello-world");
});

describe("withMethod", function () {
  [
    Method.GET,
    Method.POST,
    Method.PATCH,
    Method.PUT,
    Method.DELETE,
  ].forEach((method) =>
    it(`should set method: ${method}`, function () {
      const builder = new Fetcher(getNoopFetchMock());
      builder.withMethod(method);

      assertEquals((builder as any).method, method);
    })
  );

  itShouldReturnInstance("withMethod", Method.PATCH);
});

describe("withQueryParams", function () {
  it("should set URLSearchParams from key value pair array", function () {
    const builder = new Fetcher(getNoopFetchMock());
    builder.withQueryParams(["filter", "name^asc"], ["filter", "age^desc"]);

    assertEquals(
      (builder as any).queryParams.toString(),
      "filter=name%5Easc&filter=age%5Edesc",
    );
  });

  itShouldReturnInstance("withQueryParams", ["name", "Peter"]);
});

describe("build", function () {
  it("should return function calling fetch with correct path and options", () => {
    const fetchSpy = getNoopFetchMock();
    const service = new Fetcher(fetchSpy)
      .withPath("/hello")
      .build();

    assertEquals(typeof service, "function");
    service();

    assertSpyCallArgs(fetchSpy, 0, 0, ["/hello", { method: "GET" }]);
  });

  describe("method should validate builder state before building service function", function () {
    it("should throw error when path is not specified", function () {
      const makeService = () => new Fetcher(getNoopFetchMock()).build();

      assertThrows(makeService, Error, "Path is not specified!");
    });
  });
});

function itShouldReturnInstance<T extends keyof Fetcher & `with${string}`>(
  method: T,
  ...args: Parameters<Fetcher[T]>
) {
  it(`${method} should return builder instance`, function () {
    const builder = new Fetcher(getNoopFetchMock());
    const result = (builder[method] as any)(...args);

    assertEquals(builder, result);
  });
}
