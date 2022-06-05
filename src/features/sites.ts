import { createResource } from "../createResource";
import { defineStore } from "pinia";
export const siteSlice = createResource({
  piniaPath: "sites",
  baseUrl: "http://161.35.141.190:5000/api/v1",
  endpoints(builder): Record<string, any> {
    return {
      fetchSites: builder.query({
        query: () => `/sites`,
      }),
      updateSite: builder.mutation({
        query: (id: string, patch: Record<string, any>) => ({
          url: `/sites/${id}`,
          method: "PATCH",
          body: patch,
        }),
      }),
      deleteSite: builder.mutation({
        query: (id: string) => ({
          url: `/sites/${id}`,
          method: "DELETE",
        }),
      }),
      runCheck: builder.mutation({
        query: () => ({
          url: `/sites/check`,
          method: "POST",
        }),
      }),
    };
  },
});

export const {
  useFetchSitesResource,
  useUpdateSiteResource,
  useRunCheckResource,
  piniaPath,
} = siteSlice;

interface ISite {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  url: string;
  selector: string;
  actions: Record<string, string>;
  results: string[];
  published: boolean;
}

export const useStore = defineStore(
  siteSlice.piniaPath,
  siteSlice.getStores<ISite[]>()
);
