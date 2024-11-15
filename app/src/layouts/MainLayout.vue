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
// import getVectorStores from 'src/api/getVectorStores';
import useVecStore from 'src/api/composables/useVecStore';
import useAuth from 'src/api/composables/useAuth';

const { apiLogin } = useAuth();
const { apiGetVecStoreList } = useVecStore();

onMounted(() => {
  apiGetVecStoreList();
  if (!Cookies.get('jwtToken') || Cookies.get('jwtToken') == 'undefined') {
    // login();
    apiLogin('daniil', 'daniil');
  }
});
</script>
