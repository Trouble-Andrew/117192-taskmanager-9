import {AbstractComponent} from './abstract-component.js';

export class DateField extends AbstractComponent {
  constructor(dueDate) {
    super(dueDate);
    this._dueDate = dueDate;
  }

  getTemplate() {
    return `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${new Date(this._dueDate).toDateString()} ${new Date(this._dueDate).getHours()} ${new Date(this._dueDate).getMinutes()}"
        />
      </label>
    </fieldset>`;
  }
}
