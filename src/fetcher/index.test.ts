import {assertNotEquals} from "testing.asserts";
import {Fetcher} from "/src/fetcher/index.ts";

Deno.test("it should exist", () => {
    assertNotEquals(new Fetcher(), null);
})
