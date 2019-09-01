import {CardComponent} from './card-component.js';
import {removeElement} from './../utils.js';

export class CardEdit extends CardComponent {
  constructor(params) {
    super(params);
    this._subscribeOnEvents();
    this._removeTag();
    this._toggleDate();
    this._changeColor();
    this._toggleRepeat();
  }

  _subscribeOnEvents() {
    this.getElement()
      .querySelector(`.card__hashtag-input`).addEventListener(`keydown`, (evt) => {
        if (evt.key === `Enter`) {
          evt.preventDefault();
          this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, `<span class="card__hashtag-inner">
            <input
              type="hidden"
              name="hashtag"
              value="${evt.target.value}"
              class="card__hashtag-hidden-input"
            />
            <p class="card__hashtag-name">
              #${evt.target.value}
            </p>
            <button type="button" class="card__hashtag-delete">
              delete
            </button>
          </span>`);
          evt.target.value = ``;
        }
      });
  }

  _removeTag() {
    let allElems = this.getElement().querySelectorAll(`.card__hashtag-inner`);
    allElems.forEach(function (elem) {
      elem.querySelector(`.card__hashtag-delete`).addEventListener(`click`, () => {
        removeElement(elem);
      });
    });
  }

  _toggleDate() {
    const board = document.querySelector(`.board__tasks`);
    let dateToggler = this.getElement().querySelector(`.card__date-deadline-toggle`);
    let dateFieldEdit = this.getElement().querySelector(`.card__date-deadline`);
    let dateField = this.getElement().querySelector(`.card__dates`);
    this.getElement()
      .querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
        if (dateToggler.querySelector(`.card__date-status`).innerHTML === `yes`) {
          dateToggler.querySelector(`.card__date-status`).innerHTML = `no`;
          this._dueDate = null;
          this._dateSwitch = false;
          // removeElement(dateFieldEdit);
          dateFieldEdit.classList.add(`visually-hidden`);
          console.log(this);
        } else {
          dateToggler.querySelector(`.card__date-status`).innerHTML = `yes`;
          this._dueDate = Date.now();
          this._dateSwitch = true;
          dateFieldEdit.classList.remove(`visually-hidden`);
          console.log(this._dueDate);
          console.log(new Date(this._dueDate));
          document.querySelector(`.card__date-status`).innerHTML = `yes`;
        }
      });
  }

  _changeColor() {
    let card = this;
    let allElems = this.getElement().querySelectorAll(`.card__color-input`);
    allElems.forEach(function (elem) {
      elem.addEventListener(`click`, () => {
        card.getElement().className = `card card--edit card--${elem.value} ${Object.values(card._repeatingDays).some((it) => it === true) ? `card--repeat` : `` }`;
      });
    });
  }

  _toggleRepeat() {
    const card = this;
    const repeatToggler = this.getElement().querySelector(`.card__repeat-toggle`);
    const repeatDays = this.getElement().querySelectorAll(`.card__repeat-day-input`);
    const repeatDaysField = this.getElement().querySelector(`.card__repeat-days`);
    repeatToggler.addEventListener(`click`, () => {
      if (repeatToggler.querySelector(`.card__repeat-status`).innerHTML === `yes`) {
        repeatToggler.querySelector(`.card__repeat-status`).innerHTML = `no`;
        repeatDays.forEach(function (day) {
          day.checked = false;
        });
        repeatDaysField.classList.add(`visually-hidden`);
        card.getElement().className = `card card--edit card--${card._color}`;
      } else {
        repeatToggler.querySelector(`.card__repeat-status`).innerHTML = `yes`;
        card.getElement().className = `card card--edit card--${card._color} card--repeat`;
        repeatDaysField.classList.remove(`visually-hidden`);
        repeatDays.forEach(function (day) {
          day.checked = true;
        });
      }
    });
    repeatDays.forEach(function (day) {
      day.addEventListener(`click`, () => {
        if (Array.from(repeatDays).some((it) => it.checked === true)) {
          card.getElement().className = `card card--edit card--${card._color} card--repeat`;
        } else {
          card.getElement().className = `card card--edit card--${card._color}`;
        }
      });
    });
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${Object.values(this._repeatingDays).some((it) => it === true) ? `card--repeat` : `` }">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--archive">
                    archive
                  </button>
                  <button
                    type="button"
                    class="card__btn card__btn--favorites card__btn--disabled"
                  >
                    favorites
                  </button>
                </div>

                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text"
                    >${this._description}</textarea>
                  </label>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${this._dateSwitch === true ? `yes` : `no`}</span>
                      </button>
                      <fieldset class="card__date-deadline ${this._dateSwitch === true ? `` : `visually-hidden`}">
                        <label class="card__input-deadline-wrap">
                          <input
                            class="card__date"
                            type="text"
                            placeholder=""
                            name="date"
                            value="${this._dueDate === true ? this._dueDate.toDateString() : ``} ${this._dueDate === true ? this._dueDate.getHours() : ``} ${this._dueDate === true ? this._dueDate.getMinutes() : ``}"
                          />
                        </label>
                      </fieldset>
                      <button class="card__repeat-toggle" type="button">
                        repeat:<span class="card__repeat-status">${Object.values(this._repeatingDays).some((it) => it === true) ? `yes` : `no`}</span>
                      </button>
                      <fieldset class="card__repeat-days ${Object.values(this._repeatingDays).some((it) => it === true) === true ? `` : `visually-hidden`}">
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
                      </fieldset>
                    </div>

                    <div class="card__hashtag">
                      <div class="card__hashtag-list">

                        ${(Array.from(this._tags).map((tag) => (`
                          <span class="card__hashtag-inner">
                            <input
                              type="hidden"
                              name="hashtag"
                              value="${tag}"
                              class="card__hashtag-hidden-input"
                            />
                            <p class="card__hashtag-name">
                             #${tag}
                            </p>
                          <button type="button" class="card__hashtag-delete">
                            delete
                          </button>
                        </span>`.trim()
  ))).join(``)}
                      </div>

                      <label>
                        <input
                          type="text"
                          class="card__hashtag-input"
                          name="hashtag-input"
                          placeholder="Type new hashtag here"
                        />
                      </label>
                    </div>
                  </div>

                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                      <input
                        type="radio"
                        id="color-black-4"
                        class="card__color-input card__color-input--black visually-hidden"
                        name="color"
                        value="black"
                        ${this._color === `black` ? `checked` : ``}
                      />
                      <label
                        for="color-black-4"
                        class="card__color card__color--black"
                        >black</label
                      >
                      <input
                        type="radio"
                        id="color-yellow-4"
                        class="card__color-input card__color-input--yellow visually-hidden"
                        name="color"
                        value="yellow"
                        ${this._color === `yellow` ? `checked` : ``}
                      />
                      <label
                        for="color-yellow-4"
                        class="card__color card__color--yellow"
                        >yellow</label
                      >
                      <input
                        type="radio"
                        id="color-blue-4"
                        class="card__color-input card__color-input--blue visually-hidden"
                        name="color"
                        value="blue"
                        ${this._color === `blue` ? `checked` : ``}
                      />
                      <label
                        for="color-blue-4"
                        class="card__color card__color--blue"
                        >blue</label
                      >
                      <input
                        type="radio"
                        id="color-green-4"
                        class="card__color-input card__color-input--green visually-hidden"
                        name="color"
                        value="green"
                        ${this._color === `green` ? `checked` : ``}
                      />
                      <label
                        for="color-green-4"
                        class="card__color card__color--green"
                        >green</label
                      >
                      <input
                        type="radio"
                        id="color-pink-4"
                        class="card__color-input card__color-input--pink visually-hidden"
                        name="color"
                        value="pink"
                        ${this._color === `pink` ? `checked` : ``}
                      />
                      <label
                        for="color-pink-4"
                        class="card__color card__color--pink"
                        >pink</label
                      >
                    </div>
                  </div>
                </div>

                <div class="card__status-btns">

                </div>
              </div>
            </form>
          </article>`;
  }
}
