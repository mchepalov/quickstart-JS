class MyPanel extends HTMLElement {
  // Приватные поля для хранения ссылок на элементы
  #shadow;
  #header;
  #content;
  #footer;
  #toggleButton;

  constructor() {
    super();
  }

  connectedCallback() {
    // Срабатывает, когда пользовательский элемент впервые добавляется в DOM
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#createTemplate();
    this.#setupEventListeners();
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
          display: block;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          background: white;
          margin: 16px auto;
          overflow: hidden;
          width: 100%;
          max-width: 600px;
        }

        .panel-header {
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }

        .panel-header:hover {
          background: #f1f5f9;
        }

        .panel-title {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .panel-title h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .panel-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .panel-toggle {
          background: none;
          border: none;
          font-size: 18px;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .panel-toggle:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .panel-toggle.collapsed {
          transform: rotate(-90deg);
        }

        .panel-content {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          width: 100%;
        }

        .panel-content.collapsed {
          display: none;
        }

        .panel-footer {
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
          padding: 16px 20px;
        }

        .panel-footer.collapsed {
          display: none;
        }

        /* Стили для слотов */
        slot[name="header"] {
          display: block;
          width: 100%;
        }

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
          width: 91%;
        }

        ::slotted(p) {
          margin-bottom: 12px;
          line-height: 1.6;
          color: #374151;
        }

        ::slotted(p:last-child) {
          margin-bottom: 0;
        }

        /* Специальные стили для my-select внутри панели */
        ::slotted(my-select) {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 10px !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }
      </style>
      
      <div class="panel-header">
        <div class="panel-title">
          <h3>Панель</h3>
          <p class="panel-subtitle">Нажмите для сворачивания/разворачивания</p>
        </div>
        <button class="panel-toggle">▼</button>
      </div>
      
      <div class="panel-content">
        <slot name="content">
          <p>Default panel content. This is a placeholder text.</p>
        </slot>
      </div>
      
      <div class="panel-footer">
        <slot name="footer"></slot>
      </div>
    `;

    this.#shadow.append(template.content.cloneNode(true));

    // Инициализация приватных полей
    this.#header = this.#shadow.querySelector('.panel-header');
    this.#content = this.#shadow.querySelector('.panel-content');
    this.#footer = this.#shadow.querySelector('.panel-footer');
    this.#toggleButton = this.#shadow.querySelector('.panel-toggle');
  }

  #setupEventListeners() {
    // Обработчик клика на заголовок для сворачивания/разворачивания
    if (this.#header) {
      this.#header.addEventListener('click', () => this.#togglePanel());
    }
  }

  #togglePanel() {
    const isCollapsed = this.#content.classList.contains('collapsed');

    if (isCollapsed) {
      this.#expandPanel();
    } else {
      this.#collapsePanel();
    }
  }

  #expandPanel() {
    if (this.#content) this.#content.classList.remove('collapsed');
    if (this.#footer) this.#footer.classList.remove('collapsed');
    if (this.#toggleButton) this.#toggleButton.classList.remove('collapsed');
  }

  #collapsePanel() {
    if (this.#content) this.#content.classList.add('collapsed');
    if (this.#footer) this.#footer.classList.add('collapsed');
    if (this.#toggleButton) this.#toggleButton.classList.add('collapsed');
  }

  // Публичные методы для управления панелью
  expand() {
    this.#expandPanel();
  }

  collapse() {
    this.#collapsePanel();
  }

  toggle() {
    this.#togglePanel();
  }
}

// Регистрируем компонент
customElements.define('my-panel', MyPanel);

// Экспортируем класс через window
window.MyPanel = MyPanel;
