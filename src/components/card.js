import {createElement} from './../utils.js';
import {CardEdit} from './card-edit.js';
import {removeElement} from './../utils.js';

export class Card {
  constructor({description, dueDate, tags, color, repeatingDays}) {
    this._description = description;
    this._dueDate = new Date(dueDate);
    this._tags = tags;
    this._color = color;
    this._element = null;
    this._repeatingDays = repeatingDays;
    this._allObj = {description, dueDate, tags, color, repeatingDays};
    this._taskEdit = new CardEdit(this._allObj);
    this._tasksContainer = document.querySelector(`.board__tasks`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element = null;
    }
  }

  renderElement(container) {
    container.append(this.getElement());

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        container.replaceChild(this.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        container.replaceChild(this._taskEdit.getElement(), this.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, () => {
        this._tasksContainer.replaceChild(this.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`.card__delete`)
      .addEventListener(`click`, () => {
        removeElement(this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._taskEdit.removeElement();
      });
  }

  getTemplate() {
    return `<article class="card card--${this._color} ${Object.values(this._repeatingDays).some((it) => it === true) ? `card--repeat` : `` }">
            <div class="card__form">
              <div class="card__inner">
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--edit">
                    edit
                  </button>
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
                  <p class="card__text">${this._description}</p>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <div class="card__date-deadline">
                        <p class="card__input-deadline-wrap">
                          <span class="card__date">${this._dueDate.toDateString()}</span>
                          <span class="card__time">${this._dueDate.getHours()}:${this._dueDate.getMinutes()}</span>
                        </p>
                      </div>
                    </div>

                    <div class="card__hashtag">
                      <div class="card__hashtag-list">
                        ${(Array.from(this._tags).map((tag) => (`
                          <span class="card__hashtag-inner">
                          <input type="hidden" name="hashtag" value="${tag}" class="card__hashtag-hidden-input" />
                          <button type="button" class="card__hashtag-name">#${tag}</button>
                          <button type="button" class="card__hashtag-delete">delete</button>
                        </span>`.trim()
  ))).join(``)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>`;
  }
}
