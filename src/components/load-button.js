import {AbstractComponent} from './abstract-component.js';
// export const getLoadButtonMarkup = () => `<button class="load-more" type="button">load more</button>
// `;
export class LoadButton extends AbstractComponent {
  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }
}
