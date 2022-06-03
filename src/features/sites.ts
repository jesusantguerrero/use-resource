import { createResource } from "../index";

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

export const { useFetchSitesResource, useRunCheckResource } = siteSlice;
