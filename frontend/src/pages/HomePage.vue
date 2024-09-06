<template>
  <q-page>
    <q-scroll-area class="scroll-area" ref="scrollArea">
      <HeroComponent v-model="scrollCount" @wheel="onScroll" />
      <q-page> 123 </q-page>
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HeroComponent from 'src/components/Home/HeroComponent.vue';
import SimpleBarVue from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

const scrollCount = ref(0);
const scrollThreshold = 10;
const scrollArea = ref(null);

const onScroll = (e: WheelEvent) => {
  if (window.pageYOffset == 0) {
    if (scrollCount.value < scrollThreshold) {
      e.preventDefault();
      if (e.deltaY > 0 && scrollCount.value < scrollThreshold) {
        scrollCount.value += 1;
      }
    }
    if (e.deltaY < 0 && scrollCount.value > 0) {
      scrollCount.value -= 1;
    }
  }
};

// onMounted(() => {
//   if (scrollArea.value) {
//     new SimpleBar(scrollArea.value);
//   }
// });
</script>

<style scoped>
.full-screen-block {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  position: relative;
  background-color: #f0f0f0;
}

.scroll-area {
  height: 100vh;
  width: 100%;
  overflow-y: hidden; /* Prevent normal scrolling */
}

.counter {
  font-size: 5rem;
}
</style>
