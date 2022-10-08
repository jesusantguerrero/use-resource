import type { log } from "console";
import type { Ref } from "vue";
import type { ResourceHookCaller } from "./useResource";

export type ResourceStoreGenerator = typeof generateStores;

type ResourceKeyType = "mutator" | "data";
export type ResourceStore<T> = {
  data?: Ref<T | null>;
  refresh: () => Promise<void>;
  execute: () => Promise<void>;
  mutate: (data: T) => void;
  isLoading: Ref<boolean>;
  type: string;
} & {
  [key in ResourceKeyType]: Promise<void> | Ref<T | null>;
};
export default function generateStores<T>(
  context: Record<string, ResourceHookCaller>
) {
  return function () {
    const [main, reducer] = context.useFetchSitesResource<T>();
    console.log(main, reducer);

    const hookMainName = reducer.type == "mutator" ? "mutator" : "data";
    return {
      [hookMainName]: main,
      ...reducer,
    };
  };
}
