import { spy } from "https://deno.land/std@0.150.0/testing/mock.ts";
import { Fetch } from "/src/interfaces.ts";

export const getNoopFetchMock = () => spy((() => {}) as unknown as Fetch);
