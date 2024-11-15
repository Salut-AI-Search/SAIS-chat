import { Ref, ref, onMounted, onUnmounted } from 'vue';

export const usePopup = (popup: Ref) => {
  const isPopupVisible = ref(false);
  const popupPosition = ref({ x: 0, y: 0 });

  const togglePopup = (event) => {
    isPopupVisible.value = true;

    if (isPopupVisible.value) {
      popupPosition.value = { x: event.clientX, y: event.clientY };
    }
  };

  const handleClickOutside = (event) => {
    if (!isPopupVisible.value) return;

    const button = document.querySelector('.create-chat');
    const popup = document.querySelector('.popup');

    if (!button.contains(event.target) && !popup.contains(event.target)) {
      isPopupVisible.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
  });

  return { isPopupVisible, popupPosition, togglePopup };
};
