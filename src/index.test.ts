import { it, describe, expect, vi, beforeAll, afterAll } from "vitest";
import { useResource, type ResourceResult } from ".";
import { withSetup } from "./utils/testHelpers";
import { until } from "@vueuse/core";
import { server } from "./__tests__/mocks/server";

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
    const [result] = withSetup<ResourceResult<[]>>(() =>
      useResource(siteEndpoint)
    );
    expect(result.isLoading).toBeTruthy();
    await result.refresh().then(() => {
      expect(fetchSpy).toHaveBeenCalled();
      expect(result.data.value).toBeTruthy();
    });
  });

  it("should request data immediately", async () => {
    const { data, isLoading } = useResource(siteEndpoint);

    await until(isLoading).toBe(false);

    expect(fetchSpy).toHaveBeenCalled();
    expect(data.value).toBeTruthy();
  });
});
