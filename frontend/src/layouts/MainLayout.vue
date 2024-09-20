<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import useAuth from 'src/api/composables/useAuth';
import { onMounted } from 'vue';

const { apiLogin } = useAuth();

onMounted(() => {
  apiLogin('vdmk', '123');
});
</script>
