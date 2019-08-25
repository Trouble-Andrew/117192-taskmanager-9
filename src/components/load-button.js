import {CardAbstractComponent} from './card-abstract-component.js';
// export const getLoadButtonMarkup = () => `<button class="load-more" type="button">load more</button>
// `;
export class LoadButton extends CardAbstractComponent {
  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }
}
