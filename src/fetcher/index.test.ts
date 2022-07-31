import {
  assertEquals,
  assertObjectMatch,
  assertThrows,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { Fetcher } from "/src/fetcher/index.ts";
import { describe, it } from "https://deno.land/std@0.150.0/testing/bdd.ts";
import {
  assertSpyCallArg,
  spy,
} from "https://deno.land/std@0.150.0/testing/mock.ts";

type Fetch = typeof fetch;

const getNoopFetchMock = () => spy((() => {}) as unknown as Fetch);

it("should assign retrieved fetch and default values to new object", function () {
  const fetchSpy = getNoopFetchMock();
  const fetcher = new Fetcher(fetchSpy);
  assertObjectMatch(fetcher, { fetch: fetchSpy, path: undefined });
});

describe("withPath", function () {
  it("should modify path", function () {
    const builder = new Fetcher(getNoopFetchMock());
    builder.withPath("/world");

    assertEquals((builder as any).path, "/world");
  });

  it("should return builder instance", function () {
    const builder = new Fetcher(getNoopFetchMock());
    const builderWithPath = builder.withPath("/world");

    assertEquals(builder, builderWithPath);
  });
});

describe("build", function () {
  it("should return function calling fetch with correct path", () => {
    const fetchSpy = getNoopFetchMock();
    const service = new Fetcher(fetchSpy)
        .withPath("/hello")
        .build();

    assertEquals(typeof service, "function");
    service();

    assertSpyCallArg(fetchSpy, 0, 0, "/hello");
  });

  describe("method should validate builder state before building service function", function () {
    it("should throw error when path is not specified", function () {
      const makeService = () => new Fetcher(getNoopFetchMock()).build();

      assertThrows(makeService, Error, "Path is not specified!");
    });
  });
});
