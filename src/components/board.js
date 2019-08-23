import {CardAbstractComponent} from './card-abstract-component.js';

export class Board extends CardAbstractComponent {
  getTemplate() {
    return `<section class="board container"></section>`;
  }
}
