<script>
    import { onMount } from 'svelte';
    import Svrollbar from 'svrollbar';
    
    let scrollAmount = 0;
    let maxScroll = 1000; // Задаем максимальный скролл до достижения 10
  
    // Функция для обработки события скролла
    const handleScroll = (e) => {
      scrollAmount += e.deltaY;
      
      // Ограничиваем значение от 0 до 10
      if (scrollAmount >= maxScroll) {
        scrollAmount = maxScroll;
        // Разблокируем скролл страницы
        document.body.style.overflow = 'auto';
      }
    };
  
    onMount(() => {
      // Блокируем скролл страницы
      document.body.style.overflow = 'hidden';
    });
  
    // Вычисляем число на основе скролла (максимум до 10)
    $: displayedNumber = Math.min(10, Math.floor(scrollAmount / (maxScroll / 10)));
  </script>
  
  <style>
    .scroll-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 5rem;
      background-color: #f0f0f0;
      overflow: hidden; /* Скрываем стандартный скролл */
    }
  </style>
  
  <div class="scroll-container">
    <Svrollbar on:wheel={handleScroll}>
      <div>
        {displayedNumber}
      </div>
    </Svrollbar>
  </div>
  