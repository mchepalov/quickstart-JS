// Web Worker для выполнения тяжелых вычислений
// Этот код выполняется в отдельном потоке и создает вложенный воркер

console.log(
  '[THREAD.JS] Промежуточный воркер инициализирован и готов к работе'
);

let nestedWorker = null;

// Обработчик сообщений от основного потока
self.addEventListener('message', (evt) => {
  const { timeout } = evt.data;
  console.log('[THREAD.JS] Получено сообщение от основного потока:', {
    timeout,
  });

  // Создаем вложенный воркер, если он еще не создан
  if (!nestedWorker) {
    console.log('[THREAD.JS] Создаем вложенный воркер thread2.js');
    nestedWorker = new Worker('./thread2.js');

    // Обработчик сообщений от вложенного воркера
    nestedWorker.addEventListener('message', (event) => {
      const result = event.data;
      console.log('[THREAD.JS] Получен результат от thread2.js:', result);

      // Отправляем результат обратно в основной поток
      console.log('[THREAD.JS] Отправляем результат в основной поток');
      self.postMessage({
        type: 'result',
        result: result.result,
        iterations: result.iterations,
        duration: result.duration,
      });
    });

    // Обработчик ошибок вложенного воркера
    nestedWorker.onerror = (error) => {
      console.error('[THREAD.JS] Ошибка во вложенном воркере:', error);
      self.postMessage({
        type: 'error',
        message: 'Произошла ошибка во вложенном воркере',
      });
    };
  }

  // Отправляем задачу во вложенный воркер
  console.log(
    '[THREAD.JS] Отправляем задачу в thread2.js с timeout:',
    timeout || 3000
  );
  nestedWorker.postMessage({ timeout: timeout || 3000 });
});

// Обработчик ошибок
self.onerror = (error) => {
  console.error('Ошибка в Web Worker:', error);
  self.postMessage({
    type: 'error',
    message: 'Произошла ошибка при выполнении вычислений',
  });
};
