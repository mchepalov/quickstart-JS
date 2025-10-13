// Service Worker для кеширования результатов вычислений
// Этот код выполняется в отдельном потоке и может работать между вкладками

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

// Кеш для хранения результатов
const cache = {
  result: null,
};

// Функция пересчета с сохранением в кеш
const recalculate = (timeout) => {
  cache.result = slowFunction(timeout);
  return cache.result;
};

// Функция получения закешированного результата
const getCachedResult = (timeout) => {
  const cachedResult = cache.result;
  if (cachedResult) {
    return cachedResult;
  } else {
    return recalculate(timeout);
  }
};

// Функция отправки сообщения во все активные вкладки
const broadcast = async (msg) => {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage(msg);
  }
};

// Обработчик активации сервис-воркера
self.addEventListener('activate', async (evt) => {
  console.log('Service Worker активирован');
  evt.waitUntil(self.clients.claim());
});

// Обработчик сообщений от веб-страниц
self.addEventListener('message', (evt) => {
  console.log('Service Worker получил сообщение:', evt.data);

  const { type, timeout } = evt.data;

  if (type === 'getCached') {
    // Запрос закешированного результата
    const result = getCachedResult(timeout || 3000);
    broadcast({
      type: 'cachedResult',
      result: result,
    });
  } else if (type === 'recalculate') {
    // Принудительная перегенерация
    const result = recalculate(timeout || 3000);
    broadcast({
      type: 'newResult',
      result: result,
    });
  }
});
