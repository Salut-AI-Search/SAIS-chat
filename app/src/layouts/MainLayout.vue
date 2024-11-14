<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Cookies from 'js-cookie';
import login from 'src/api/login';
import getVectorStores from 'src/api/getVectorStores';

onMounted(() => {
  getVectorStores();
  if (!Cookies.get('jwtToken') || Cookies.get('jwtToken') == 'undefined') {
    login();
  }
});
</script>
