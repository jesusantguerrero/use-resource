import { ref, type Ref } from "vue";

export interface ResourceResultProperties<T> {
  data?: Ref<T | null>;
  refresh: () => Promise<void>;
  execute: () => Promise<void>;
  mutate: (data: T) => void;
  isLoading: Ref<boolean>;
  type: string;
}

export type ResourceResult<T> = [
  Ref<T | null> | Promise<void>,
  ResourceResultProperties<T>
];

export function queryBuilder(
  baseUrl: string,
  fetcherConfig?: string | Record<string, any>
) {
  let defaultConfig = {
    url: baseUrl,
  };

  if (fetcherConfig && typeof fetcherConfig == "string") {
    defaultConfig = {
      url: `${baseUrl}${fetcherConfig}`,
    };
  } else if (fetcherConfig) {
    defaultConfig = {
      // @ts-expect-error: we are sure of the type of fetcherConfig
      ...fetcherConfig,
      // @ts-expect-error: we know is not a string at this point
      url: baseUrl + fetcherConfig?.url,
    };
  }

  return function <T>(method = "get", config = fetcherConfig): any {
    return fetch(defaultConfig?.url, {
      method,
      // @ts-expect-error: we are sure of the type of config
      ...config,
    }).then((response) => {
      return response.json();
    });
  };
}

export type ResourceFetcher = typeof queryBuilder;

export function useResource<T>(
  baseUrl: string,
  fetcherConfig?: string | Record<string, any>,
  fetcher?: ResourceFetcher
): ResourceResult<T>;
export function useResource<T>(
  baseUrl: string,
  fetcherConfig?: string | Record<string, any>,
  fetcher: ResourceFetcher = queryBuilder
): ResourceResult<T> {
  const localFetcher = fetcher || queryBuilder;
  const data = ref<T>();
  const isLoading = ref(false);
  const builder = localFetcher(baseUrl, fetcherConfig);

  const fetchRequest = async () => {
    try {
      isLoading.value = true;
      data.value = undefined;
      const result = await builder();
      data.value = result;
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const mutate = (payload: T) => {
    data.value = payload;
  };

  const isQuery = !fetcherConfig ||
  typeof fetcherConfig == "string" ||
  fetcherConfig?.method == "get"
  
  if (isQuery) {
    fetchRequest();
  }

  return [
    // @ts-expect-error: we are sure of the type of data
    data,
    {
      refresh: fetchRequest,
      execute: fetchRequest,
      mutate,
      isLoading,
      type: isQuery ? "query" : "mutation",
    },
  ];
}

interface IQueryConfig {
  query: (...args: any[]) => string;
}

export function createBuilder(baseUrl: string) {
  return {
    query: (config: IQueryConfig) => {
      return config.query();
    },
    mutation: (config: IQueryConfig) => {
      return config.query();
    },
  };
}

function RHC<T>(): ResourceResult<T> {
  return useResource<T>("");
}

export type ResourceHookCaller = typeof RHC;
