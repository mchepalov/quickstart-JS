class MySelect extends HTMLElement {
  // Приватные поля для хранения ссылок на элементы
  #selectButton;
  #selectPopup;
  #selectPopupSearch;
  #optionsBox;
  #options = []; // Массив для хранения данных опций

  constructor() {
    super();

    // Получаем название компонента из data-атрибута скрипта
    const currentScript = document.currentScript;
    const componentName = currentScript
      ? currentScript.dataset.name
      : 'my-select';
  }

  connectedCallback() {
    // Срабатывает, когда пользовательский элемент впервые добавляется в DOM
    this.#createTemplate();
    this.#renderOptions();
  }

  disconnectedCallback() {
    // Срабатывает, когда пользовательский элемент удаляется из DOM
  }

  adoptedCallback() {
    // Срабатывает, когда пользовательский элемент перемещён в новый документ
  }

  attributeChangedCallback() {
    // Срабатывает, когда пользовательскому элементу добавляют, удаляют или изменяют атрибут
  }

  #createTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `
    <h3>Веб-компонент my-select:</h3>
      <button class="select-button">Кнопка выбора</button>
      <div class="select-popup">
        <input class="select-popup-search" placeholder="Search..." />
        <div class="select-popup-options"></div>
      </div>
    `;

    this.append(template.content.cloneNode(true));

    // Инициализация приватных полей
    this.#selectButton = this.querySelector('.select-button');
    this.#selectPopup = this.querySelector('.select-popup');
    this.#selectPopupSearch = this.querySelector('.select-popup-search');
    this.#optionsBox = this.querySelector('.select-popup-options');
  }

  #renderOptions() {
    // Получаем все элементы option из содержимого компонента
    const optionElements = this.querySelectorAll('option');

    // Преобразуем их в массив объектов
    this.#options = Array.from(optionElements).map((option) => ({
      value: option.value,
      text: option.textContent,
    }));

    // Создаем template для опций
    const template = document.createElement('template');
    const optionsHTML = this.#options
      .map(
        (option) =>
          // В одну строчку иначе в label будут пробелы в начале и конце
          `<label class="option" data-value="${option.value}"><input type="checkbox" value="${option.value}"/>${option.text}</label>`
      )
      .join('');

    template.innerHTML = optionsHTML;

    // Очищаем контейнер и добавляем новые опции
    this.#optionsBox.innerHTML = '';
    this.#optionsBox.append(template.content.cloneNode(true));

    // Удаляем оригинальные элементы option из DOM
    optionElements.forEach((option) => option.remove());
  }
}

// Экспортируем класс через window
window.MySelect = MySelect;
