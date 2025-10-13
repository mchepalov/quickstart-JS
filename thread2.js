// Вложенный Web Worker для выполнения тяжелых вычислений
// Этот код выполняется в отдельном потоке, созданном из thread.js

console.log('[THREAD2.JS] Вложенный воркер инициализирован и готов к работе');

// Функция для тяжелых вычислений
const slowFunction = (timeout = 3000) => {
  let start = performance.now();
  let x = 0;
  let i = 0;

  do {
    i += 1;
    x += (Math.random() - 0.5) * i;
  } while (performance.now() - start < timeout);

  return {
    result: x,
    iterations: i,
    duration: Math.round(performance.now() - start),
  };
};

// Обработчик сообщений от родительского воркера (thread.js)
self.addEventListener('message', (evt) => {
  const { timeout } = evt.data;
  console.log('[THREAD2.JS] Получено сообщение от thread.js:', { timeout });

  console.log(
    '[THREAD2.JS] Начинаем выполнение slowFunction с timeout:',
    timeout || 3000
  );
  const startTime = performance.now();

  // Выполняем тяжелые вычисления
  const result = slowFunction(timeout || 3000);

  const endTime = performance.now();
  console.log(
    '[THREAD2.JS] slowFunction завершена за:',
    Math.round(endTime - startTime),
    'мс'
  );
  console.log('[THREAD2.JS] Результат вычислений:', result);

  // Отправляем результат обратно в родительский воркер
  console.log('[THREAD2.JS] Отправляем результат в thread.js');
  self.postMessage(result);
});

// Обработчик ошибок
self.onerror = (error) => {
  console.error('Ошибка во вложенном Web Worker:', error);
  self.postMessage({
    error: true,
    message: 'Произошла ошибка при выполнении вычислений во вложенном воркере',
  });
};
