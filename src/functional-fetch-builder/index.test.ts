
import { describe, it } from "https://deno.land/std@0.150.0/testing/bdd.ts";
import {
    assertEquals,
  } from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { createFetchBuilder } from "/src/functional-fetch-builder/index.ts";
import { getNoopFetchMock } from "/__test__/utils.ts";
import {
  assertSpyCall,
} from "https://deno.land/std@0.150.0/testing/mock.ts";

it("should return build function", () => {
    const builder = createFetchBuilder({ fetch: getNoopFetchMock() }, { withPath: "" });

    assertEquals("build" in builder, true)
    assertEquals(typeof (builder as any).build, "function")
});

describe("build", () => {
  it("should call fetch",  () => {
    const fetchMock = getNoopFetchMock();
    createFetchBuilder({ fetch: fetchMock }, { withPath: "" }).build()();

    assertSpyCall(fetchMock, 0);
  })
})

describe("withPath", () => {
  it("should assign path to builder", () => {
    const builder = createFetchBuilder({ fetch: getNoopFetchMock() }, { withPath: "/example/image.png" });

    assertEquals("path" in builder, true);
    assertEquals((builder as any).path, "/example/image.png")
  })
})