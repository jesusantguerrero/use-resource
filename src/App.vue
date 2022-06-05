<script setup lang="ts">
import { ref, toRaw, unref, type Ref } from "vue";
import {
  useUpdateSiteResource,
  useRunCheckResource,
  useStore,
  type ISite,
} from "./features/sites";

const store = useStore();
const [runCheck, { isLoading: isChecking, mutate }] = useRunCheckResource();
const [updateSite] = useUpdateSiteResource();
console.log(updateSite);

const siteToEdit = ref<ISite>();
const editSite = (site: ISite) => {
  siteToEdit.value = site;
};

const update = () => {
  updateSite(siteToEdit.value.id, toRaw(siteToEdit.value));
  siteToEdit.value = null;
}

const isEditing = (siteId: number) => {
  return siteToEdit.value && siteToEdit.value.id === siteId;
};
</script>

<template>
  <main>
    <header>
      <h1>These Are the site versions</h1>
      <button @click="store.refresh()">Reload</button>
      <button @click="runCheck">
        {{ isChecking ? "Checking..." : "Check Sites" }}
      </button>
    </header>
    <ul v-if="store.data">
      <li v-for="site in store.data" :key="site.id">
        <p v-if="!isEditing(site.id)">
          {{ site.title }} <button @click="editSite(site)">Edit</button>
        </p>
        <div v-else>
          <input v-model="site.title" />
          <button @click="update()">Update</button>
        </div>
      </li>
    </ul>
    <template v-else-if="store.isLoading">
      <li>Loading...</li>
    </template>
  </main>
</template>
