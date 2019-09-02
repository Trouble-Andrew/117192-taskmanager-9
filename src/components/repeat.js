import {AbstractComponent} from './abstract-component.js';

export class RepeatField extends AbstractComponent {
  constructor(repeatingDays) {
    super(repeatingDays);
    this._repeatingDays = repeatingDays;
  }

  getTemplate() {
    return `<fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        <input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-mo-4"
          name="repeat"
          value="mo"
          ${this._repeatingDays[`mo`] === true ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-mo-4"
          >mo</label
        >
        <input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-tu-4"
          name="repeat"
          value="tu"
          ${this._repeatingDays[`tu`] === true ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-tu-4"
          >tu</label
        >
        <input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-we-4"
          name="repeat"
          value="we"
          ${this._repeatingDays[`we`] === true ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-we-4"
          >we</label
        >
        <input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-th-4"
          name="repeat"
          value="th"
          ${this._repeatingDays[`th`] === true ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-th-4"
          >th</label
        >
        <input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-fr-4"
          name="repeat"
          value="fr"
          ${this._repeatingDays[`fr`] === true ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-fr-4"
          >fr</label
        >
        <input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          name="repeat"
          value="sa"
          id="repeat-sa-4"
          ${this._repeatingDays[`sa`] === true ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-sa-4"
          >sa</label
        >
        <input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-su-4"
          name="repeat"
          value="su"
          ${this._repeatingDays[`su`] === true ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-su-4"
          >su</label
        >
      </div>
    </fieldset>`;
  }
}
