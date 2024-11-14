import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
  state: () => ({
    vectorStores: [] as string[],
  }),
  getters: {
    getVectorStores: (state) => {
      return state.vectorStores;
    },
  },
  actions: {
    setVectorStores(newVectorStores: string[]) {
      this.vectorStores = newVectorStores;
    },
  },
});
