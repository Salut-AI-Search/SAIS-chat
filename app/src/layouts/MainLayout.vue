<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useVecStore from 'src/api/composables/useVecStore';

const { apiGetVecStoreList } = useVecStore();

onMounted(() => {
  apiGetVecStoreList();
});
</script>
