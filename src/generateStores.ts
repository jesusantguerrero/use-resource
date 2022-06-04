import { toRefs } from "vue";
import type { ResourceHookCaller } from ".";

export default function generateStores<T>(
  context: Record<string, ResourceHookCaller>
) {
  return function () {
    const [main, reducer] = context.useFetchSitesResource<T>();

    const hookMainName = reducer.type == "mutator" ? "mutator" : "data";
    return {
      [hookMainName]: main,
      ...reducer,
    };
  };
}
