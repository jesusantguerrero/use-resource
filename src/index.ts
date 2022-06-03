import { onMounted, ref, type Ref } from "vue";

export interface ResourceResult<T> {
  data: Ref<T | null>;
  refresh: () => Promise<void>;
  isLoading: Ref<boolean>;
}

export function queryBuilder(baseUrl: string) {
  return function <T>(method = "get", config = {}): any {
    return fetch(baseUrl, {
      method,
      ...config,
    }).then((response) => response.json());
  };
}

export type ResourceFetcher = typeof queryBuilder;

export function useResource<T>(
  baseUrl: string,
  fetcher?: ResourceFetcher
): ResourceResult<T>;
export function useResource<T>(
  baseUrl: string,
  fetcher: ResourceFetcher = queryBuilder
): ResourceResult<T> {
  const localFetcher = fetcher || queryBuilder;
  const data = ref(null);
  const isLoading = ref(false);
  const builder = localFetcher(baseUrl);

  const fetchRequest = async () => {
    try {
      isLoading.value = true;
      data.value = null;
      const result = await builder();
      data.value = result;
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchRequest();
  });

  return {
    data,
    refresh: fetchRequest,
    isLoading,
  };
}
