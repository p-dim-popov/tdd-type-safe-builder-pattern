import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { Fetcher } from "/src/fetcher/index.ts";
import it = Deno.test;
import {
  assertSpyCallArg,
  spy,
} from "https://deno.land/std@0.150.0/testing/mock.ts";

type Fetch = typeof fetch;

const getNoopFetchMock = () => spy((() => {}) as unknown as Fetch);

it("should assign retrieved fetch and path to new object", function () {
  const fetchSpy = getNoopFetchMock();
  const fetcher = new Fetcher(fetchSpy, "/hello");
  assertObjectMatch(fetcher, { fetch: fetchSpy, path: "/hello" });
});

it("should have build method, returning function calling fetch with initialized path", () => {
  const fetchSpy = getNoopFetchMock();
  const service = new Fetcher(fetchSpy, "/hello").build();

  assertEquals(typeof service, "function");
  service();

  assertSpyCallArg(fetchSpy, 0, 0, "/hello");
});

it('should have withPath method for modifying fetch path', function () {
  const builder = new Fetcher(getNoopFetchMock(), "/hello")
  builder.withPath("/world");

  assertEquals((builder as any).path, "/world")
});
