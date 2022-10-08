import { it, describe, expect, vi, beforeAll, afterAll } from "vitest";
import { useResource, type ResourceQueryResult } from "../useResource";
import { withSetup } from "./utils/testHelpers";
import { until } from "@vueuse/core";
import { server } from "./mocks/server";
import type { resolveBaseUrl } from "vite";
import type { buildEndpoints } from "@/createResource";

const fetchSpy = vi.spyOn(window, "fetch");
const siteEndpoint = "https://example.com/api/sites";
describe("useResource", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("should request", async () => {
    const [result, { isLoading, refresh }] = withSetup<ResourceQueryResult<[]>>(() =>
      useResource(siteEndpoint)
    );
    expect(isLoading).toBeTruthy();
    await refresh().then(() => {
      expect(fetchSpy).toHaveBeenCalled();
      expect(result.data.value).toBeTruthy();
    });
  });

  it("should request data immediately", async () => {
    const [data, { isLoading }] = useResource(siteEndpoint);

    await until(isLoading).toBe(false);

    expect(fetchSpy).toHaveBeenCalled();
    expect(data.value).toBeTruthy();
  });
});

describe("Build endpoints" , () => {
  const baseUrl = "https://example.com/"
  const endpoints = {
    fetchSites: {
      query: () => `/sites`,
    },
  };
  const context = buildEndpoints(resolveBaseUrl, endpoints);
  expect(context).toBe({});
})
