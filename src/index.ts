import { ref, type Ref } from "vue";

export interface ResourceResult<T> {
  data: Ref<T | null>;
  refresh: () => Promise<void>;
  execute: () => Promise<void>;
  isLoading: Ref<boolean>;
}

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

  console.log(defaultConfig.url);
  return function <T>(method = "get", config = fetcherConfig): any {
    return fetch(defaultConfig?.url, {
      method,
      // @ts-expect-error: we are sure of the type of config
      ...config,
    }).then((response) => {
      return response.json()
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
    console.log("Here we go");
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

  console.log({ fetcherConfig })
  if (
    !fetcherConfig ||
    typeof fetcherConfig == "string" ||
    fetcherConfig?.method == "get"
  ) {
    console.log("called");
    fetchRequest();
  }

  return {
    // @ts-expect-error: we are sure of the type of data
    data,
    refresh: fetchRequest,
    execute: fetchRequest,
    mutate,
    isLoading,
  };
}

type ResourceHook = typeof useResource;

export interface CreateResourceProps {
  piniaPath: string;
  baseUrl: string;
  endpoints: (builder: any) => Record<string, any>;
}

interface IQueryConfig {
  query: (...args: any[]) => string;
}

function createBuilder(baseUrl: string) {
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
export function createResource({
  piniaPath,
  baseUrl,
  endpoints,
}: CreateResourceProps): Record<string, ResourceHookCaller> {
  console.log(endpoints);
  const endpointconfig = endpoints(createBuilder(baseUrl));

  return Object.entries(endpointconfig).reduce(
    (reducer, [hookName, config]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - this is a hack to get the type of the function
      reducer[`use${capitalize(hookName)}Resource`] = function <T>() {
        return useResource<T>(baseUrl, config, queryBuilder);
      };

      return reducer;
    },
    {}
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
