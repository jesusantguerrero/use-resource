import { config } from "./../config/index";
import { createResource } from "@/createResource";

export const siteApi = createResource({
  piniaPath: "sites",
  baseUrl: config.sitesEndpoint,
  endpoints: {
    fetchSites: {
      method: "GET",
      query: () => `/sites`,
    },
    storeSite: {
      method: "POST",
      query: (data: Record<string, any>) => ({
        url: `/sites/${id}`,
        body: data,
      }),
    },
    updateSite: {
      method: "PATCH",
      query: (id: string, data: Record<string, any>) => ({
        url: `/sites/${id}`,
        body: data,
      }),
    },
    deleteSite: {
      method: "DELETE",
      query: (id: string) => ({
        url: `/sites/${id}`,
      }),
    },
    runCheck: {
      method: "POST",
      query: () => ({
        url: `/sites/check`,
      }),
    },
  },
});

export const {
  useUpdateSiteResource,
  useRunCheckResource,
  useFetchSitesResource,
  piniaPath,
} = siteApi;
