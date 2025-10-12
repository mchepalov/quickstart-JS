class MySelect extends HTMLElement {
  // Приватные поля для хранения ссылок на элементы
  #shadow;
  #selectButton;
  #selectPopup;
  #selectPopupSearch;
  #optionsBox;
  #selectedOptionsDisplay;
  #options = []; // Массив для хранения данных опций
  #selectedValues = []; // Массив для хранения выбранных значений

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
    this.#shadow = this.attachShadow({ mode: 'open' });
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
      <style>
        :host {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 10px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 100%;
          height: 300px;
          box-sizing: border-box;
          overflow: visible;
        }

        .select-button {
          padding: 12px 16px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .select-button:hover {
          border-color: #9ca3af;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .select-button:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .select-button::after {
          content: '▼';
          font-size: 10px;
          color: #6b7280;
          transition: transform 0.2s ease;
        }

        .select-button.open::after {
          transform: rotate(180deg);
        }

        .select-popup {
          display: none;
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 100%;
          background: white;
          border: 1px solid #d1d5db;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          z-index: 1000;
          max-width: 100%;
          box-sizing: border-box;
        }

        .select-popup.open {
          display: block;
        }

        .select-popup-search {
          width: calc(100% - 32px);
          padding: 12px 16px;
          border: none;
          border-bottom: 1px solid #e5e7eb;
          outline: none;
          font-size: 14px;
          color: #374151;
          background: #f9fafb;
          border-radius: 6px 6px 0 0;
        }

        .select-popup-search:focus {
          background: white;
          border-bottom-color: #3b82f6;
        }

        .select-popup-search::placeholder {
          color: #9ca3af;
        }

        .select-popup-options {
          max-height: 200px;
          overflow-y: auto;
        }

        .option {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.15s ease;
          font-size: 14px;
          color: #374151;
        }

        .option:hover {
          background-color: #f3f4f6;
        }

        .option:last-child {
          border-bottom: none;
          border-radius: 0 0 6px 6px;
        }

        .option input[type="checkbox"] {
          margin-right: 12px;
          width: 16px;
          height: 16px;
          accent-color: #3b82f6;
        }
      </style>
      
      <h3>Веб-компонент my-select:</h3>
      <p id="selectedOptionsDisplay">Ничего не выбрано</p>
      <button class="select-button">
        Выберите опции
        <div class="select-popup">
          <input class="select-popup-search" placeholder="Поиск опций..." />
          <div class="select-popup-options"></div>
        </div>
      </button>
    `;

    this.#shadow.append(template.content.cloneNode(true));

    // Инициализация приватных полей
    this.#selectButton = this.#shadow.querySelector('.select-button');
    this.#selectPopup = this.#shadow.querySelector('.select-popup');
    this.#selectPopupSearch = this.#shadow.querySelector(
      '.select-popup-search'
    );
    this.#optionsBox = this.#shadow.querySelector('.select-popup-options');
    this.#selectedOptionsDisplay = this.#shadow.querySelector(
      '#selectedOptionsDisplay'
    );

    // Добавляем обработчик клика на кнопку
    this.#selectButton.addEventListener('click', () => this.#openPopup());

    // Предотвращаем закрытие попапа при клике на его содержимое
    this.#selectPopup.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Добавляем обработчик для закрытия по клику вне компонента
    document.addEventListener('click', (e) => this.#handleOutsideClick(e));
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

    // Добавляем обработчики для выбора опций
    this.#setupOptionHandlers();

    // Добавляем простой поиск
    this.#setupSearch();
  }

  #setupSearch() {
    const searchInput = this.#shadow.querySelector('.select-popup-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const options = this.#optionsBox.querySelectorAll('.option');

        options.forEach((option) => {
          const text = option.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            option.style.display = 'flex';
          } else {
            option.style.display = 'none';
          }
        });
      });
    }
  }

  #handleOutsideClick(e) {
    if (
      !this.contains(e.target) &&
      this.#selectPopup.classList.contains('open')
    ) {
      this.#closePopup();
    }
  }

  #openPopup() {
    this.#selectPopup.classList.toggle('open');
    this.#selectButton.classList.toggle('open');
  }

  #closePopup() {
    this.#selectPopup.classList.remove('open');
    this.#selectButton.classList.remove('open');

    // Очищаем поле поиска
    if (this.#selectPopupSearch) {
      this.#selectPopupSearch.value = '';
      // Показываем все опции после очистки поиска
      const options = this.#optionsBox.querySelectorAll('.option');
      options.forEach((option) => {
        option.style.display = 'flex';
      });
    }
  }

  #setupOptionHandlers() {
    const options = this.#optionsBox.querySelectorAll('.option');

    options.forEach((optionElement) => {
      const checkbox = optionElement.querySelector('input[type="checkbox"]');
      const value = optionElement.dataset.value;

      // Добавляем обработчик изменения чекбокса
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события

        if (e.target.checked) {
          // Добавляем значение в выбранные
          if (!this.#selectedValues.includes(value)) {
            this.#selectedValues.push(value);
          }
        } else {
          // Удаляем значение из выбранных
          this.#selectedValues = this.#selectedValues.filter(
            (v) => v !== value
          );
        }

        // Обновляем отображение выбранных опций
        this.#updateSelectedOptions();
      });

      // Добавляем обработчик клика для опции, чтобы предотвратить закрытие попапа
      optionElement.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }

  #updateSelectedOptions() {
    // Получаем тексты выбранных опций
    const selectedTexts = this.#selectedValues.map((value) => {
      const option = this.#options.find((opt) => opt.value === value);
      return option ? option.text : value;
    });

    // Обновляем отображение в параграфе
    if (this.#selectedOptionsDisplay) {
      if (selectedTexts.length === 0) {
        this.#selectedOptionsDisplay.textContent = 'Ничего не выбрано';
      } else {
        this.#selectedOptionsDisplay.textContent = selectedTexts.join(', ');
      }
    }
  }
}

// Регистрируем компонент
customElements.define('my-select', MySelect);

// Экспортируем класс через window
window.MySelect = MySelect;
