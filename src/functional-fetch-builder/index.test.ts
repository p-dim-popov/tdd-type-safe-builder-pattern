
import { describe, it } from "https://deno.land/std@0.150.0/testing/bdd.ts";
import {
    assertEquals,
  } from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { createFetchBuilder } from "/src/functional-fetch-builder/index.ts";

it("should return build function", () => {
    const builder = createFetchBuilder({ withPath: "" });

    assertEquals("build" in builder, true)
    assertEquals(typeof (builder as any).build, "function")
});

describe("withPath", () => {
  it("should assign path to builder", () => {
    const builder = createFetchBuilder({ withPath: "/example/image.png" });

    assertEquals("path" in builder, true);
    assertEquals((builder as any).path, "/example/image.png")
  })
})