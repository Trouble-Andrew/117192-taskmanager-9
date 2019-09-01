import {AbstractComponent} from './abstract-component.js';

export class EditButton extends AbstractComponent {
  getTemplate() {
    return `<button type="button" class="card__btn card__btn--edit">
      edit
    </button>`;
  }
}
