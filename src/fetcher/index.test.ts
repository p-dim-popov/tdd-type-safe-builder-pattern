import {assertEquals, assertObjectMatch} from "https://deno.land/std@0.150.0/testing/asserts.ts";
import {Fetcher} from "/src/fetcher/index.ts";
import it = Deno.test;
import {
    assertSpyCall, assertSpyCallArg,
    spy,
} from "https://deno.land/std@0.150.0/testing/mock.ts";

it('should assign retrieved fetch and path to new object', function () {
    const fetchSpy = spy((() => {}) as unknown as typeof fetch);
    const fetcher = new Fetcher(fetchSpy, "/hello");
    assertObjectMatch(fetcher, { fetch: fetchSpy, path: "/hello" })
});

it("should have build method, returning function calling fetch with initialized path", () => {
    const fetchSpy = spy((() => {}) as unknown as typeof fetch);
    const service = new Fetcher(fetchSpy, "/hello").build();

    assertEquals(typeof service, "function");
    service();

    assertSpyCallArg(fetchSpy, 0, 0, "/hello")
})
