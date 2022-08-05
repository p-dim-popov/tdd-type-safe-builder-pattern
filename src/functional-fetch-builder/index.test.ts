
import { it } from "https://deno.land/std@0.150.0/testing/bdd.ts";
import {
    assertEquals,
  } from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { createFetchBuilder } from "./index.ts";

it("should return build function", () => {
    const builder = createFetchBuilder();

    assertEquals("build" in builder, true)
    assertEquals(typeof (builder as any).build, "function")
})