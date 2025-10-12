// Web Worker для выполнения тяжелых вычислений
// Этот код выполняется в отдельном потоке

// Функция для тяжелых вычислений
const slowFunction = (timeout = 3000) => {
  let start = performance.now();
  let x = 0;
  let i = 0;

  do {
    i += 1;
    x += (Math.random() - 0.5) * i;

    // Отправляем прогресс каждые 100 итераций
    if (i % 100 === 0) {
      const elapsed = performance.now() - start;
      const progress = Math.min(100, Math.round((elapsed / timeout) * 100));

      self.postMessage({
        type: 'progress',
        progress: progress,
      });
    }
  } while (performance.now() - start < timeout);

  return {
    result: x,
    iterations: i,
    duration: Math.round(performance.now() - start),
  };
};

// Обработчик сообщений от основного потока
self.onmessage = (event) => {
  const { timeout } = event.data;

  // Выполняем тяжелые вычисления
  const startTime = performance.now();
  const result = slowFunction(timeout);
  const endTime = performance.now();

  // Отправляем результат обратно в основной поток
  self.postMessage({
    type: 'result',
    result: result.result,
    iterations: result.iterations,
    duration: result.duration,
  });
};

// Обработчик ошибок
self.onerror = (error) => {
  console.error('Ошибка в Web Worker:', error);
  self.postMessage({
    type: 'error',
    message: 'Произошла ошибка при выполнении вычислений',
  });
};
