import { describe, it } from "https://deno.land/std@0.150.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { createFetchBuilder } from "/src/functional-fetch-builder/index.ts";
import { getNoopFetchMock } from "/__test__/utils.ts";
import {
  assertSpyCall,
  assertSpyCallArgs,
} from "https://deno.land/std@0.150.0/testing/mock.ts";
import { HttpMethod } from "../common.ts";

it("should return build function", () => {
  const builder = createFetchBuilder({ fetch: getNoopFetchMock() }, {
    withPath: "",
    withHttpMethod: HttpMethod.GET,
  });

  assertEquals("build" in builder, true);
  assertEquals(typeof (builder as any).build, "function");
});

describe("build", () => {
  it("should call fetch", () => {
    const fetchMock = getNoopFetchMock();
    createFetchBuilder({ fetch: fetchMock }, {
      withPath: "",
      withHttpMethod: HttpMethod.GET,
    }).build()();

    assertSpyCall(fetchMock, 0);
  });
});

describe("withPath", () => {
  it("should set path as fetch call arg", () => {
    const fetchMock = getNoopFetchMock();
    createFetchBuilder({ fetch: fetchMock }, {
      withPath: "/example/image.png",
      withHttpMethod: HttpMethod.GET,
    })
      .build()();

    assertSpyCallArgs(fetchMock, 0, 0, 1, ["/example/image.png"]);
  });

  it("should work with FQ path", () => {
    const fetchMock = getNoopFetchMock();
    createFetchBuilder({ fetch: fetchMock }, {
      withPath: "https://example.com/example/image.png",
      withHttpMethod: HttpMethod.GET,
    })
      .build()();

    assertSpyCallArgs(fetchMock, 0, 0, 1, [
      "https://example.com/example/image.png",
    ]);
  });

  it("should work with non FQ path", () => {
    const fetchMock = getNoopFetchMock();
    createFetchBuilder({ fetch: fetchMock }, {
      withPath: "/users",
      withHttpMethod: HttpMethod.GET,
    })
      .build()();

    assertSpyCallArgs(fetchMock, 0, 0, 1, ["/users"]);
  });
});

describe("withQuery", () => {
  it("should prepare correct query", () => {
    const fetchMock = getNoopFetchMock();
    createFetchBuilder({ fetch: fetchMock }, {
      withPath: "/users",
      withHttpMethod: HttpMethod.GET,
      withQuery: [["sort", "name^asc"], ["sort", "age^desc"]],
    })
      .build()();

    assertSpyCallArgs(fetchMock, 0, 0, 1, [
      encodeURI("/users?sort=name^asc&sort=age^desc"),
    ]);
  });

  it("should preserve query params from path", () => {
    const fetchMock = getNoopFetchMock();
    createFetchBuilder({ fetch: fetchMock }, {
      withPath: "/users?filter=age>50",
      withHttpMethod: HttpMethod.GET,
      withQuery: [["sort", "name^asc"], ["sort", "age^desc"]],
    })
      .build()();

    assertSpyCallArgs(fetchMock, 0, 0, 1, [
      encodeURI("/users?filter=age>50&sort=name^asc&sort=age^desc"),
    ]);
  });
});

describe("withHttpMethod", () => {
  it("should set method", () => {
    const fetchMock = getNoopFetchMock();
    createFetchBuilder({ fetch: fetchMock }, {
      withPath: "/",
      withHttpMethod: HttpMethod.DELETE,
    })
      .build()();

    assertSpyCallArgs(fetchMock, 0, ["/", { method: HttpMethod.DELETE }]);
  });
});
