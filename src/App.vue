<script setup lang="ts">
import { useResource } from ".";
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
const {
  data: sites,
  refresh,
  isLoading,
} = useResource<ISite[]>("http://161.35.141.190:5000/api/v1/sites");
</script>

<template>
  <main>
    <header>
      <h1>Sites</h1>
      <button @click="refresh()">Reload</button>
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
