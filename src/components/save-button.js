import {AbstractComponent} from './abstract-component.js';

export class SaveButton extends AbstractComponent {
  getTemplate() {
    return `<button class="card__save" type="submit">save</button>`;
  }
}
