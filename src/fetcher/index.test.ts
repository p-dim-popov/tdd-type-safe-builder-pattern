import {assertEquals, assertNotEquals} from "testing.asserts";
import {Fetcher} from "/src/fetcher/index.ts";
import test = Deno.test;

test("it should exist", () => {
    assertNotEquals(new Fetcher(), null);
});

test("it should have build method, returning function", () => {
    const service = new Fetcher().build();

    assertEquals(typeof service, "function")
})
