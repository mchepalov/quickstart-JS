class MyCard extends HTMLElement {
  // Приватные поля для хранения ссылок на элементы
  #shadow;
  #headerElement;
  #subHeaderElement;

  // Статическое поле для отслеживания атрибутов
  static observedAttributes = ['header', 'sub-header'];

  constructor() {
    super();
  }

  connectedCallback() {
    // Срабатывает, когда пользовательский элемент впервые добавляется в DOM
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#createTemplate();
    this.#initializeElements();
  }

  disconnectedCallback() {
    // Срабатывает, когда пользовательский элемент удаляется из DOM
  }

  adoptedCallback() {
    // Срабатывает, когда пользовательский элемент перемещён в новый документ
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Срабатывает, когда пользовательскому элементу добавляют, удаляют или изменяют атрибут
    if (name === 'header' && this.#headerElement) {
      this.#headerElement.textContent = newValue || 'Заголовок по умолчанию';
    }

    if (name === 'sub-header' && this.#subHeaderElement) {
      this.#subHeaderElement.textContent =
        newValue || 'Подзаголовок по умолчанию';
    }
  }

  #createTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          background: white;
          margin: 16px auto;
          overflow: hidden;
          width: 100%;
          max-width: 400px;
        }

        .card-header {
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 20px;
        }

        .card-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .card-subtitle {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #6b7280;
        }

        .card-content {
          padding: 20px;
        }

        .card-footer {
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
          padding: 16px 20px;
        }

        /* Стили для слотов */
        slot[name="content"] {
          display: block;
          width: 100%;
        }

        slot[name="footer"] {
          display: block;
          width: 100%;
        }

        /* Стили для контента без слотов */
        ::slotted(*) {
          margin: 0;
          width: 100%;
        }

        ::slotted(p) {
          margin-bottom: 12px;
          line-height: 1.6;
          color: #374151;
        }

        ::slotted(p:last-child) {
          margin-bottom: 0;
        }
      </style>
      
      <div class="card-header">
        <h3 class="card-title">Заголовок по умолчанию</h3>
        <p class="card-subtitle">Подзаголовок по умолчанию</p>
      </div>
      
      <div class="card-content">
        <slot name="content">
          <p>Это содержимое карточки по умолчанию. Здесь может быть любой текст.</p>
        </slot>
      </div>
      
      <div class="card-footer">
        <slot name="footer"></slot>
      </div>
    `;

    this.#shadow.append(template.content.cloneNode(true));
  }

  #initializeElements() {
    // Инициализация приватных полей
    this.#headerElement = this.#shadow.querySelector('.card-title');
    this.#subHeaderElement = this.#shadow.querySelector('.card-subtitle');

    // Устанавливаем начальные значения из атрибутов
    const headerValue = this.getAttribute('header');
    const subHeaderValue = this.getAttribute('sub-header');

    if (headerValue && this.#headerElement) {
      this.#headerElement.textContent = headerValue;
    }

    if (subHeaderValue && this.#subHeaderElement) {
      this.#subHeaderElement.textContent = subHeaderValue;
    }
  }
}

// Регистрируем компонент
customElements.define('my-card', MyCard);

// Экспортируем класс через window
window.MyCard = MyCard;
