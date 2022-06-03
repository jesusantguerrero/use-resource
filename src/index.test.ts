import { it, describe, expect, vi } from "vitest";
import { useResource, type ResourceResult } from ".";
import { withSetup } from "./utils/testHelpers";
import { until } from "@vueuse/core";

const fetchSpy = vi.spyOn(window, "fetch");
describe("useResource", () => {
  it("should request", async () => {
    const [result] = withSetup<ResourceResult<[]>>(() =>
      useResource("http://161.35.141.190:5000/api/v1/sites")
    );
    expect(result.isLoading).toBeTruthy();
    await result.refresh().then(() => {
      expect(fetchSpy).toHaveBeenCalled();
      expect(result.data.value).toBeTruthy();
    });
  });

  it("should request data on setup", async () => {
    const [result] = withSetup<ResourceResult<[]>>(() =>
      useResource("http://161.35.141.190:5000/api/v1/sites")
    );
    expect(result.isLoading.value).toBeTruthy();
    expect(fetchSpy).toHaveBeenCalled();
    await until(result.isLoading.value).toBe(false);
    expect(result.data.value).toBeTruthy();
  });
});
