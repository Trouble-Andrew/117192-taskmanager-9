import {AbstractComponent} from './abstract-component.js';

export class DeleteButton extends AbstractComponent {
  getTemplate() {
    return `<button class="card__delete" type="button">delete</button>`;
  }
}
