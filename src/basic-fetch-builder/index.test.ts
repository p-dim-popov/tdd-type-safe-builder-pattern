import {
  assertEquals,
  assertObjectMatch,
  assertThrows,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { BasicFetchBuilder, HttpMethod } from "/src/basic-fetch-builder/index.ts";
import { describe, it } from "https://deno.land/std@0.150.0/testing/bdd.ts";
import {
  assertSpyCallArgs,
  spy,
} from "https://deno.land/std@0.150.0/testing/mock.ts";

type Fetch = typeof fetch;

const getNoopFetchMock = () => spy((() => {}) as unknown as Fetch);

describe('constructor', function () {
  it("should assign retrieved fetch and default values to new object", function () {
    const fetchSpy = getNoopFetchMock();
    const fetcher = new BasicFetchBuilder(fetchSpy);
    assertObjectMatch(fetcher, { fetch: fetchSpy });
  });
});

describe("withPath", function () {
  it("should modify path", function () {
    const builder = new BasicFetchBuilder(getNoopFetchMock());
    builder.withPath("/world");

    assertEquals((builder as any).path, "/world");
  });

  itShouldReturnInstance("withPath", "/hello-world");
});

describe("withMethod", function () {
  [
    HttpMethod.GET,
    HttpMethod.POST,
    HttpMethod.PATCH,
    HttpMethod.PUT,
    HttpMethod.DELETE,
  ].forEach((method) =>
    it(`should set method: ${method}`, function () {
      const builder = new BasicFetchBuilder(getNoopFetchMock());
      builder.withMethod(method);

      assertEquals((builder as any).method, method);
    })
  );

  itShouldReturnInstance("withMethod", HttpMethod.PATCH);
});

describe("withQueryParams", function () {
  it("should set URLSearchParams from key value pair array", function () {
    const builder = new BasicFetchBuilder(getNoopFetchMock());
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
    const service = new BasicFetchBuilder(fetchSpy)
      .withPath("/hello")
      .withMethod(HttpMethod.GET)
      .withQueryParams(["filter", "name^asc"])
      .build();

    assertEquals(typeof service, "function");
    service();

    assertSpyCallArgs(fetchSpy, 0, 0, ["/hello?filter=name%5Easc", { method: "GET" }]);
  });

  describe("method should validate builder state before building service function", function () {
    it("should throw error when path is not specified", function () {
      const makeService = () => new BasicFetchBuilder(getNoopFetchMock()).withMethod(HttpMethod.GET).build();

      assertThrows(makeService, Error, "Path is not specified!");
    });

    it('should throw error when method is not specified', function () {
      const makeService = () => new BasicFetchBuilder(getNoopFetchMock()).withPath("/").build();

      assertThrows(makeService, Error, "Http method is not specified!");
    });
  });
});

function itShouldReturnInstance<T extends keyof BasicFetchBuilder & `with${string}`>(
  method: T,
  ...args: Parameters<BasicFetchBuilder[T]>
) {
  it(`${method} should return builder instance`, function () {
    const builder = new BasicFetchBuilder(getNoopFetchMock());
    const result = (builder[method] as any)(...args);

    assertEquals(builder, result);
  });
}
