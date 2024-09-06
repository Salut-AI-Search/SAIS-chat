<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: number;
}>();

const rotationX = ref(0);
const rotationY = ref(0);

watch(props, () => {
  rotationX.value = props.modelValue * 36;
});
</script>

<template>
  <TresCanvas clear-color="#82DBC5" window-size>
    <TresPerspectiveCamera :position="[5, 5, 5]" :look-at="[0, 0, 0]" />
    <TresMesh :rotation="[rotationX, rotationY, 0]">
      <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
      <TresMeshBasicMaterial color="orange" />
    </TresMesh>
    <TresAmbientLight :intensity="1" />
  </TresCanvas>
</template>
