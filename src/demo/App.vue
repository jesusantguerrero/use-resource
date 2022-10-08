<script setup lang="ts">
import { onMounted, ref, toRaw } from "vue";
import {
  useUpdateSiteResource,
  useRunCheckResource,
  useFetchSitesResource,
} from "./features/sites";
import type { ISite } from "./interfaces";

const [runCheck, { isLoading: isChecking }] = useRunCheckResource();
const [updateSite] = useUpdateSiteResource<ISite>();
const [data, { isLoading, refresh }] = useFetchSitesResource<ISite[]>();

const siteToEdit = ref<ISite>();
const editSite = (site: ISite) => {
  siteToEdit.value = site;
};

const update = () => {
  updateSite(siteToEdit.value.id, toRaw(siteToEdit.value));
  siteToEdit.value = null;
};

const isEditing = (siteId: number) => {
  return siteToEdit.value && siteToEdit.value.id === siteId;
};
</script>

<template>
  <main>
    <header>
      <h1>These Are the site versions</h1>
      <button @click="refresh()">Reload</button>
      <button @click="runCheck">
        {{ isChecking ? "Checking..." : "Check Sites" }}
      </button>
    </header>
    <ul v-if="data">
      <li v-for="site in data" :key="site.id">
        <p v-if="!isEditing(site.id)">
          {{ site.title }} <button @click="editSite(site)">Edit</button>
        </p>
        <div v-else>
          <input v-model="site.title" />
          <button @click="update()">Update</button>
        </div>
      </li>
    </ul>
    <template v-else-if="isLoading">
      <li>Loading...</li>
    </template>
  </main>
</template>
