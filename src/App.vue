<script setup lang="ts">
import { useFetchSitesResource, useRunCheckResource, siteSlice } from "./features/sites";
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
const { execute: runCheck, isLoading: isChecking } = useRunCheckResource();

const { data: sites, refresh, isLoading } = useFetchSitesResource<ISite[]>();
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
    <ul v-if="sites">
      <li v-for="site in sites" :key="site.id">
        <router-link :to="{ name: 'site', params: { id: site.id } }">
          {{ site.title }}
        </router-link>
      </li>
    </ul>
    <template v-else-if="isLoading">
      <li>Loading...</li>
    </template>
  </main>
</template>
