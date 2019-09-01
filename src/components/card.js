import {CardEdit} from './card-edit.js';
import {CardComponent} from './card-component.js';

export class Card extends CardComponent {

  constructor({description, dueDate, tags, color, repeatingDays, dateSwitch, repeatSwitch}) {
    super({description, dueDate, tags, color, repeatingDays, dateSwitch, repeatSwitch});
    this._allObj = {description, dueDate, tags, color, repeatingDays};
    this._taskEdit = new CardEdit(this._allObj);
    this._tasksContainer = document.querySelector(`.board__tasks`);
  }

  checkTasksQuantity() {
    let boardContainer = document.querySelector(`.board`);
    let allTasks = boardContainer.querySelectorAll(`.card`);
    if (allTasks.length === 0) {
      boardContainer.innerHTML = `<p class="board__no-tasks">
        Congratulations, all tasks were completed! To create a new click on
        «add new task» button.
      </p>`;
    }
  }

  getTemplate() {
    return `<article class="card card--${this._color} ${Object.values(this._repeatingDays).some((it) => it === true) ? `card--repeat` : `` }">
            <div class="card__form">
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
                  <p class="card__text">${this._description}</p>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates ${this._dateSwitch === true ? `` : `visually-hidden`}">
                      <div class="card__date-deadline">
                        <p class="card__input-deadline-wrap">
                          <span class="card__date">${this._dateSwitch === true ? this._dueDate.toDateString() : ``}</span>
                          <span class="card__time">${this._dateSwitch === true ? this._dueDate.getHours() : ``}:${this._dateSwitch === true ? this._dueDate.getMinutes() : ``}</span>
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
