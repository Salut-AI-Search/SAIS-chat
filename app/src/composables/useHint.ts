//@ts-nocheck
import { Ref, ref, watch, computed } from 'vue';
import { debounce } from 'lodash';

export const useHint = (userInput: Ref) => {
  const debounceduserInput = ref('');
  const suggestion = ref('');
  const abortController = ref<AbortController | null>(null);

  const debouncedUpdateuserInput = debounce(() => {
    debounceduserInput.value = userInput.value;
    console.log(debounceduserInput.value);
  });

  function onInput() {
    console.log('allo');
    debouncedUpdateuserInput();
  }

  watch(debounceduserInput, async (newValue) => {
    if (abortController.value) {
      abortController.value.abort();
    }

    abortController.value = new AbortController();
    const signal = abortController.value.signal;

    try {
      const result = await getSuggestion(newValue, signal);
      suggestion.value = result;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Previous request was cancelled.');
      } else {
        console.error('Error fetching suggestion:', error);
      }
      suggestion.value = '';
    }
  });

  async function getSuggestion(inputText, signal) {
    // to be finished
    return '';
  }

  const suggestedText = computed(() => {
    return suggestion.value;
  });

  function acceptSuggestion() {
    if (suggestedText.value) {
      userInput.value += suggestion.value;
      suggestion.value = '';
    }
  }

  return {
    onInput,
    acceptSuggestion,
  };
};
