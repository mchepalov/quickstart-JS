class MySelect extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <h3>Веб-компонент my-select:</h3>
                <select style="width: 200px;">
                    <option value="null"></option>
                    <option value="1">Опция 1</option>
                    <option value="2">Опция 2</option>
                    <option value="3">Опция 3</option>
                </select>
        `;
  }
}

const currentScript = document.currentScript;
const componentName = currentScript?.dataset.name || 'my-select';

if (componentName) {
  customElements.define(componentName, MySelect);
  console.log(`Компонент ${componentName} автоматически зарегистрирован`);
}
