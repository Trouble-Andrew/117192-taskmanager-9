import {CardAbstractComponent} from './card-abstract-component.js';

export class CardList extends CardAbstractComponent {
  getTemplate() {
    return `<div class="board__tasks"></div>`;
  }
}
