<script setup lang="ts">
import { useRunCheckResource, useStore } from "./features/sites";
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

const store = useStore<ISite[]>();
const { execute: runCheck, isLoading: isChecking } = useRunCheckResource();
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
        <router-link :to="{ name: 'site', params: { id: site.id } }">
          {{ site.title }}
        </router-link>
      </li>
    </ul>
    <template v-else-if="store.isLoading">
      <li>Loading...</li>
    </template>
  </main>
</template>
